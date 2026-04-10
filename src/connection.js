/**
 * Script de
 * inicialização do bot.
 *
 * Este script é
 * responsável por
 * iniciar a conexão
 * com o WhatsApp.
 *
 * Não é recomendado alterar
 * este arquivo,
 * a menos que você saiba
 * o que está fazendo.
 *
 * @author Dev Gui
 */
// import makeWASocket, {  
// const path = require("node:path");
// const fs = require("fs");

// const { question, onlyNumbers } = require("./utils");
// const {
//   default: makeWASocket,
//   DisconnectReason,
//   fetchLatestBaileysVersion,
//   isJidBroadcast,
//   isJidNewsletter,
//   isJidStatusBroadcast,
//   useMultiFileAuthState,
// } from "baileys";
// import NodeCache from "node-cache";
// import fs from "node:fs";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import pino from "pino";
// import { PREFIX, TEMP_DIR } from "./config.js";
// import { load } from "./loader.js";
// import { badMacHandler } from "./utils/badMacHandler.js";
// import { onlyNumbers, question } from "./utils/index.js";
// import {
//   bannerLog,
//   errorLog,
//   infoLog,
//   successLog,
//   warningLog,
// } from "./utils/logger.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// } = require("./utils/logger");
// const NodeCache = require("node-cache");
// const { TEMP_DIR } = require("./config");
// const { badMacHandler } = require("./utils/badMacHandler");

// if (!fs.existsSync(TEMP_DIR)) {
//   fs.mkdirSync(TEMP_DIR, { recursive: true });
// }

// const logger = pino(
//   { timestamp: () => `,"time":"${new Date().toJSON()}"` },
//   pino.destination(path.join(TEMP_DIR, "wa-logs.txt")),
// );
// logger.level = "error";

// const msgRetryCounterCache = new NodeCache();

// function formatPairingCode(code) {
//   if (!code) return code;

//   return code?.match(/.{1,4}/g)?.join("-") || code;
// }

// function clearScreenWithBanner() {
//   console.clear();
//   bannerLog();
// }

// export async function connect() {
//   const baileysFolder = path.resolve(
//     __dirname,
//     "..",
//     "assets",
//     "auth",
//     "baileys",
//   );

// /**
//  * Cria a pasta temp caso não exista
//  */
// function ensureTempDirectoryExists() {
//   const tempDirPath = path.join(__dirname, "..", "assets", "temp");
//   if (!fs.existsSync(tempDirPath)) {
//     fs.mkdirSync(tempDirPath, { recursive: true });
//   }
//   return tempDirPath;
// }

// /**
//  * Obtém a mensagem a partir da store.
//  * @param {Object} key - Chave da mensagem.
//  * @returns {Promise<Object>} Mensagem transcrita.
//  */
// async function getMessage(key) {
//   if (!store) {
//     return proto.Message.fromObject({});
//   }

//   const msg = await store.loadMessage(key.remoteJid, key.id);
//   return msg ? msg.message : undefined;
// }

// /**
//  * Conecta o socket ao WhatsApp.
//  * @param {Object} groupCache - Cache de grupos.
//  * @returns {Promise<Object>} Socket do WhatsApp.
//  */
// async function connect(groupCache) {
//   const baileysFolder = path.resolve(__dirname, "..", "assets", "auth", "baileys");
//   const { state, saveCreds } = await useMultiFileAuthState(baileysFolder);


//   const { version } = await fetchLatestBaileysVersion();

//   const { version, isLatest } = await fetchLatestBaileysVersion();


//   const socket = makeWASocket({
//     version,
//     logger,
//     defaultQueryTimeoutMs: undefined,
//     retryRequestDelayMs: 5000,
//     auth: state,
//     shouldIgnoreJid: (jid) =>
//       isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
//     connectTimeoutMs: 20_000,
//     keepAliveIntervalMs: 30_000,
//     maxMsgRetryCount: 5,
//     markOnlineOnConnect: true,
//     syncFullHistory: false,
//     emitOwnEvents: false,
//     msgRetryCounterCache,
//     shouldSyncHistoryMessage: () => false,
//   });


//   if (!socket.authState.creds.registered) {
//     clearScreenWithBanner();
//     console.log(
//       'Informe o número do bot (SP/RJ exigem 9º dígito). \nExemplo: "+5511912345678", demais estados: "+554112345678":',
//     );

//     const phoneNumber = await question("Número: ");

//     if (!phoneNumber) {
//       errorLog(
//         'Número de telefone inválido! Tente novamente com o comando "npm start".',
//       );

//       process.exit(1);
//     }

//     const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

//     console.log(`Código de pareamento: ${formatPairingCode(code)}`);
//   }

//   await handleInitialConnection(socket, groupCache);


//   socket.ev.on("connection.update", async (update) => {
//     const { connection, lastDisconnect } = update;

//     if (connection === "close") {
//       const error = lastDisconnect?.error;
//       const statusCode = error?.output?.statusCode;

//       if (
//         error?.message?.includes("Bad MAC") ||
//         error?.toString()?.includes("Bad MAC")
//       ) {
//         errorLog("Bad MAC error na desconexão detectado");

//         if (badMacHandler.handleError(error, "connection.update")) {
//           if (badMacHandler.hasReachedLimit()) {

//             warningLog(
//               "Limite de erros Bad MAC atingido. Limpando arquivos de sessão problemáticos...",
//             );

//             warningLog("Limite de erros Bad MAC atingido. Limpando arquivos de sessão problemáticos...");

//             badMacHandler.clearProblematicSessionFiles();
//             badMacHandler.resetErrorCount();

//             const newSocket = await connect(groupCache);
//             load(newSocket, groupCache);
//             return;
//           }
//         }
//       }

//       if (statusCode === DisconnectReason.loggedOut) {
//         errorLog("Bot desconectado!");
//       } else {

//         switch (statusCode) {
//           case DisconnectReason.badSession:
//             warningLog("Sessão inválida!");

//             const sessionError = new Error("Bad session detected");
//             if (badMacHandler.handleError(sessionError, "badSession")) {
//               if (badMacHandler.hasReachedLimit()) {
//                 warningLog(
//                   "Limite de erros de sessão atingido. Limpando arquivos de sessão...",
//                 );
//                 badMacHandler.clearProblematicSessionFiles();
//                 badMacHandler.resetErrorCount();
//               }
//             }
//             break;
//           case DisconnectReason.connectionClosed:
//             warningLog("Conexão fechada!");
//             break;
//           case DisconnectReason.connectionLost:
//             warningLog("Conexão perdida!");
//             break;
//           case DisconnectReason.connectionReplaced:
//             warningLog("Conexão substituída!");
//             break;
//           case DisconnectReason.multideviceMismatch:
//             warningLog("Dispositivo incompatível!");
//             break;
//           case DisconnectReason.forbidden:
//             warningLog("Conexão proibida!");
//             break;
//           case DisconnectReason.restartRequired:
//             infoLog('Me reinicie por favor! Digite "npm start".');
//             break;
//           case DisconnectReason.unavailableService:
//             warningLog("Serviço indisponível!");
//             break;
//         }

//         const newSocket = await connect();
//         load(newSocket);

//         handleDisconnectReason(statusCode);
//         const newSocket = await connect(groupCache);
//         load(newSocket, groupCache);

//       }
//     } else if (connection === "open") {
//       clearScreenWithBanner();
//       successLog("✅ Bot iniciado com sucesso!");
//       successLog("Fui conectado com sucesso!");
//       infoLog("Versão do WhatsApp Web: " + version.join("."));

//       successLog(
//         `✅ Estou pronto para uso! 
// Verifique o prefixo, digitando a palavra "prefixo" no WhatsApp. 
// O prefixo padrão definido no config.js é ${PREFIX}`,
//       );

//       infoLog("É a última versão do WhatsApp Web?: " + (isLatest ? "Sim" : "Não"));

//       badMacHandler.resetErrorCount();
//     } else if (connection === "connecting") {
//       infoLog("Conectando...");
//     } else {
//       infoLog("Atualizando conexão...");
//     }

//     await handleConnectionUpdate(socket, update, groupCache);
//   });

//   socket.ev.on("creds.update", saveCreds);

//   return socket;
// }



// /**
//  * Lida com o primeiro processo de conexão e configuração do socket.
//  * @param {Object} socket - Socket do WhatsApp.
//  * @param {Object} groupCache - Cache de grupos.
//  */
// async function handleInitialConnection(socket, groupCache) {
//   if (!socket.authState.creds.registered) {
//     await promptForPhoneNumber(socket);
//   }

//   load(socket, groupCache);
// }

// /**
//  * Lida com as atualizações da conexão do socket.
//  * @param {Object} socket - Socket do WhatsApp.
//  * @param {Object} update - Atualização da conexão.
//  * @param {Object} groupCache - Cache de grupos.
//  */
// async function handleConnectionUpdate(socket, update, groupCache) {
//   const { connection, lastDisconnect } = update;

//   if (connection === "close") {
//     await handleConnectionClose(lastDisconnect);
//     const newSocket = await connect(groupCache);
//     load(newSocket, groupCache);
//   } else if (connection === "open") {
//     successLog("Fui conectado com sucesso!");
//   } else {
//     infoLog("Atualizando conexão...");
//   }
// }

// /**
//  * Lida com o fechamento da conexão.
//  * @param {Object} lastDisconnect - Detalhes do último desconexão.
//  */
// async function handleConnectionClose(lastDisconnect) {
//   const statusCode = lastDisconnect.error?.output?.statusCode;

//   if (statusCode === DisconnectReason.loggedOut) {
//     errorLog("Bot desconectado!");
//   } else {
//     handleDisconnectReason(statusCode);
//   }
// }

// /**
//  * Exibe uma mensagem de erro com base no statusCode.
//  * @param {number} statusCode - Código do status da desconexão.
//  */
// function handleDisconnectReason(statusCode) {
//   switch (statusCode) {
//     case DisconnectReason.badSession:
//       warningLog("Sessão inválida!");
//       break;
//     case DisconnectReason.connectionClosed:
//       warningLog("Conexão fechada!");
//       break;
//     case DisconnectReason.connectionLost:
//       warningLog("Conexão perdida!");
//       break;
//     case DisconnectReason.connectionReplaced:
//       warningLog("Conexão substituída!");
//       break;
//     case DisconnectReason.multideviceMismatch:
//       warningLog("Dispositivo incompatível!");
//       break;
//     case DisconnectReason.forbidden:
//       warningLog("Conexão proibida!");
//       break;
//     case DisconnectReason.restartRequired:
//       infoLog('Me reinicie por favor! Digite "npm start".');
//       break;
//     case DisconnectReason.unavailableService:
//       warningLog("Serviço indisponível!");
//       break;
//   }
// }

// /**
//  * Solicita o número de telefone do bot caso ainda não esteja registrado.
//  * @param {Object} socket - Socket do WhatsApp.
//  */
// async function promptForPhoneNumber(socket) {
//   warningLog("Credenciais ainda não configuradas!");
//   infoLog('Informe o número de telefone do bot (exemplo: "5511920202020"):');

//   const phoneNumber = await question("Informe o número de telefone do bot: ");

//   if (!phoneNumber) {
//     errorLog('Número de telefone inválido! Tente novamente com o comando "npm start".');
//     process.exit(1);
//   }

//   const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
//   sayLog(`Código de pareamento: ${code}`);
// }

// // Garante que a pasta temp exista.
// ensureTempDirectoryExists();

// // Exporta a função principal
// exports.connect = connect;


import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidNewsletter,
  isJidStatusBroadcast,
  useMultiFileAuthState,
} from "baileys";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import NodeCache from "node-cache";
import pino from "pino";

import { PREFIX, TEMP_DIR } from "./config.js";
import { load } from "./loader.js";
import { question, onlyNumbers } from "./utils/index.js";
import { badMacHandler } from "./utils/badMacHandler.js";
import {
  bannerLog,
  errorLog,
  infoLog,
  successLog,
  warningLog,
} from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TEMP DIR
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// LOGGER
const logger = pino(
  { timestamp: () => `,"time":"${new Date().toJSON()}"` },
  pino.destination(path.join(TEMP_DIR, "wa-logs.txt"))
);

logger.level = "error";

// CACHE
const msgRetryCounterCache = new NodeCache();

// HELPERS
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatPairingCode(code) {
  return code?.match(/.{1,4}/g)?.join("-") || code;
}

function clearScreenWithBanner() {
  console.clear();
  bannerLog();
}

// MAIN CONNECT
export async function connect(groupCache) {
  const baileysFolder = path.resolve(
    __dirname,
    "..",
    "assets",
    "auth",
    "baileys"
  );

  const { state, saveCreds } = await useMultiFileAuthState(baileysFolder);

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: state,
    printQRInTerminal: false,
    markOnlineOnConnect: true,
    msgRetryCounterCache,
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) ||
      isJidStatusBroadcast(jid) ||
      isJidNewsletter(jid),
  });

  // Pairing Code
  if (!sock.authState.creds.registered) {
    clearScreenWithBanner();

    console.log("Digite o número do bot (ex: 55119xxxxxxx)");
    const phoneNumber = await question("Número: ");

    const code = await sock.requestPairingCode(onlyNumbers(phoneNumber));
    console.log("Código:", formatPairingCode(code));
  }

  // Load system
  load(sock, groupCache);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    if (connection === "close") {
      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("Bot desconectado!");
        return;
      }

      warningLog("Reconectando...");
      setTimeout(() => connect(groupCache), 3000);
    }

    if (connection === "open") {
      clearScreenWithBanner();
      successLog("Bot conectado com sucesso!");
      infoLog(`Prefixo: ${PREFIX}`);
      infoLog(`WhatsApp: ${isLatest ? "Latest" : "Old version"}`);
    }

    if (connection === "connecting") {
      infoLog("Conectando...");
    }
  });

  return sock;
}