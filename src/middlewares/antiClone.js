const fs = require("fs");
const path = require("path");

const warnTracker = new Map(); // Map para rastrear advertências

const LOG_PATH = path.join(__dirname, "../logs/banimentos.json");
if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, "[]", "utf-8");

module.exports = async function antiCloneMiddleware({ sock, m, isGroup, sender, groupMetadata }) {
  try {
    if (!isGroup || !groupMetadata) return;

    const botJid = sock.user.id;
    const senderJid = sender;
    const senderNumber = senderJid.split("@")[0];

    // Heurística simples para detecção de clonagem
    const isCloningAttempt =
      m.key.fromMe === false &&
      m.key.participant === botJid &&
      m.key.remoteJid === groupMetadata.id;

    if (!isCloningAttempt) return;

    const attempts = warnTracker.get(senderJid) || 0;

    if (attempts === 0) {
      // Primeira tentativa: Advertência
      warnTracker.set(senderJid, 1);

      await sock.sendMessage(groupMetadata.id, {
        text: `🚨 *Advertência de clonagem detectada!*\n@${senderNumber}, sua ação foi registrada. Caso insista, você será removido.`,
        mentions: [senderJid],
      });

    } else {
      // Segunda tentativa: Banir + Log
      warnTracker.delete(senderJid);

      await sock.groupParticipantsUpdate(groupMetadata.id, [senderJid], "remove");

      const logEntry = {
        motivo: "Tentativa de clonagem do bot",
        grupo: groupMetadata.subject,
        nome_usuario: m.pushName || "Desconhecido",
        numero: senderNumber,
        remoteJid: senderJid,
        data: new Date().toLocaleString("pt-BR"),
      };

      const existingLogs = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
      existingLogs.push(logEntry);
      fs.writeFileSync(LOG_PATH, JSON.stringify(existingLogs, null, 2), "utf-8");

      await sock.sendMessage(groupMetadata.id, {
        text: `🚫 @${senderNumber} foi removido por tentar clonar o bot.`,
        mentions: [senderJid],
      });
    }
  } catch (err) {
    console.error("Erro no middleware antiClone:", err);
  }
};
