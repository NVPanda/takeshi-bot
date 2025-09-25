const path = require("node:path");
const fs = require("fs");

const { question, onlyNumbers } = require("./utils");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  isJidStatusBroadcast,
  isJidNewsletter,
} = require("baileys");
const pino = require("pino");
const { load } = require("./loader");
const {
  warningLog,
  infoLog,
  errorLog,
  sayLog,
  successLog,
} = require("./utils/logger");
const NodeCache = require("node-cache");
const { TEMP_DIR } = require("./config");
const { badMacHandler } = require("./utils/badMacHandler");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const logger = pino(
  { timestamp: () => `,"time":"${new Date().toJSON()}"` },
  pino.destination(path.join(TEMP_DIR, "wa-logs.txt"))
);
logger.level = "error";

const msgRetryCounterCache = new NodeCache();

/**
 * Cria a pasta temp caso não exista
 */
function ensureTempDirectoryExists() {
  const tempDirPath = path.join(__dirname, "..", "assets", "temp");
  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath, { recursive: true });
  }
  return tempDirPath;
}

/**
 * Obtém a mensagem a partir da store.
 * @param {Object} key - Chave da mensagem.
 * @returns {Promise<Object>} Mensagem transcrita.
 */
async function getMessage(key) {
  if (!store) {
    return proto.Message.fromObject({});
  }

  const msg = await store.loadMessage(key.remoteJid, key.id);
  return msg ? msg.message : undefined;
}

/**
 * Conecta o socket ao WhatsApp.
 * @param {Object} groupCache - Cache de grupos.
 * @returns {Promise<Object>} Socket do WhatsApp.
 */
async function connect(groupCache) {
  const baileysFolder = path.resolve(__dirname, "..", "assets", "auth", "baileys");
  const { state, saveCreds } = await useMultiFileAuthState(baileysFolder);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger,
    defaultQueryTimeoutMs: undefined,
    retryRequestDelayMs: 5000,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    keepAliveIntervalMs: 30_000,
    maxMsgRetryCount: 5,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
  });

  await handleInitialConnection(socket, groupCache);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const error = lastDisconnect?.error;
      const statusCode = error?.output?.statusCode;

      if (
        error?.message?.includes("Bad MAC") ||
        error?.toString()?.includes("Bad MAC")
      ) {
        errorLog("Bad MAC error na desconexão detectado");

        if (badMacHandler.handleError(error, "connection.update")) {
          if (badMacHandler.hasReachedLimit()) {
            warningLog("Limite de erros Bad MAC atingido. Limpando arquivos de sessão problemáticos...");
            badMacHandler.clearProblematicSessionFiles();
            badMacHandler.resetErrorCount();

            const newSocket = await connect(groupCache);
            load(newSocket, groupCache);
            return;
          }
        }
      }

      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("Bot desconectado!");
      } else {
        handleDisconnectReason(statusCode);
        const newSocket = await connect(groupCache);
        load(newSocket, groupCache);
      }
    } else if (connection === "open") {
      successLog("Fui conectado com sucesso!");
      infoLog("Versão do WhatsApp Web: " + version.join("."));
      infoLog("É a última versão do WhatsApp Web?: " + (isLatest ? "Sim" : "Não"));
      badMacHandler.resetErrorCount();
    } else {
      infoLog("Atualizando conexão...");
    }

    await handleConnectionUpdate(socket, update, groupCache);
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

/**
 * Lida com o primeiro processo de conexão e configuração do socket.
 * @param {Object} socket - Socket do WhatsApp.
 * @param {Object} groupCache - Cache de grupos.
 */
async function handleInitialConnection(socket, groupCache) {
  if (!socket.authState.creds.registered) {
    await promptForPhoneNumber(socket);
  }

  load(socket, groupCache);
}

/**
 * Lida com as atualizações da conexão do socket.
 * @param {Object} socket - Socket do WhatsApp.
 * @param {Object} update - Atualização da conexão.
 * @param {Object} groupCache - Cache de grupos.
 */
async function handleConnectionUpdate(socket, update, groupCache) {
  const { connection, lastDisconnect } = update;

  if (connection === "close") {
    await handleConnectionClose(lastDisconnect);
    const newSocket = await connect(groupCache);
    load(newSocket, groupCache);
  } else if (connection === "open") {
    successLog("Fui conectado com sucesso!");
  } else {
    infoLog("Atualizando conexão...");
  }
}

/**
 * Lida com o fechamento da conexão.
 * @param {Object} lastDisconnect - Detalhes do último desconexão.
 */
async function handleConnectionClose(lastDisconnect) {
  const statusCode = lastDisconnect.error?.output?.statusCode;

  if (statusCode === DisconnectReason.loggedOut) {
    errorLog("Bot desconectado!");
  } else {
    handleDisconnectReason(statusCode);
  }
}

/**
 * Exibe uma mensagem de erro com base no statusCode.
 * @param {number} statusCode - Código do status da desconexão.
 */
function handleDisconnectReason(statusCode) {
  switch (statusCode) {
    case DisconnectReason.badSession:
      warningLog("Sessão inválida!");
      break;
    case DisconnectReason.connectionClosed:
      warningLog("Conexão fechada!");
      break;
    case DisconnectReason.connectionLost:
      warningLog("Conexão perdida!");
      break;
    case DisconnectReason.connectionReplaced:
      warningLog("Conexão substituída!");
      break;
    case DisconnectReason.multideviceMismatch:
      warningLog("Dispositivo incompatível!");
      break;
    case DisconnectReason.forbidden:
      warningLog("Conexão proibida!");
      break;
    case DisconnectReason.restartRequired:
      infoLog('Me reinicie por favor! Digite "npm start".');
      break;
    case DisconnectReason.unavailableService:
      warningLog("Serviço indisponível!");
      break;
  }
}

/**
 * Solicita o número de telefone do bot caso ainda não esteja registrado.
 * @param {Object} socket - Socket do WhatsApp.
 */
async function promptForPhoneNumber(socket) {
  warningLog("Credenciais ainda não configuradas!");
  infoLog('Informe o número de telefone do bot (exemplo: "5511920202020"):');

  const phoneNumber = await question("Informe o número de telefone do bot: ");

  if (!phoneNumber) {
    errorLog('Número de telefone inválido! Tente novamente com o comando "npm start".');
    process.exit(1);
  }

  const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
  sayLog(`Código de pareamento: ${code}`);
}

// Garante que a pasta temp exista.
ensureTempDirectoryExists();

// Exporta a função principal
exports.connect = connect;