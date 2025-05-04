/**
 * Interceptadores diversos.
 *
 * @author Dev Gui
 */
const { PREFIX, OWNER_NUMBER } = require("../config");
const { toUserJid } = require("../utils");

exports.verifyPrefix = (prefix) => PREFIX === prefix;
exports.hasTypeOrCommand = ({ type, command }) => type && command;

exports.isLink = (text) => {
  const regex = /(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?)/g;
  return regex.test(text);
};

exports.isAdmin = async ({ remoteJid, userJid, socket }) => {
  const { participants, owner } = await socket.groupMetadata(remoteJid);

  const participant = participants.find(
    (participant) => participant.id === userJid
  );

  if (!participant) {
    return false;
  }

  const isOwner =
    participant.id === owner ||
    participant.admin === "superadmin" ||
    participant.id === toUserJid(OWNER_NUMBER);

  const isAdmin = participant.admin === "admin";

  return isOwner || isAdmin;
};

const { sessions: buttonSessions } = require("./comandos/banControl");

sock.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];
  if (!m?.message?.buttonsResponseMessage) return;

  const { selectedButtonId } = m.message.buttonsResponseMessage;
  const [action, targetJid] = selectedButtonId.split("::");
  const groupId = m.key.remoteJid;
  const messageId = m.message.buttonsResponseMessage.id;
  const sender = m.key.participant || m.key.remoteJid;
  const senderNumber = sender.split("@")[0];

  const session = buttonSessions.get(messageId);
  if (!session) return sock.sendMessage(groupId, { text: "⚠️ Sessão expirada ou inválida." });

  // Verifica se quem clicou é quem criou a sessão
  if (session.owner !== sender) {
    return sock.sendMessage(groupId, {
      text: `⚠️ Apenas @${session.owner.split("@")[0]} pode usar esses botões.`,
      mentions: [session.owner],
    });
  }

  if (action === "ban") {
    try {
      await sock.groupParticipantsUpdate(groupId, [targetJid], "remove");
      await sock.sendMessage(groupId, {
        text: `🚫 @${targetJid.split("@")[0]} foi removido com sucesso.`,
        mentions: [targetJid],
      });
    } catch (err) {
      await sock.sendMessage(groupId, { text: "Erro ao banir o usuário." });
    }
  }

  if (action === "unban") {
    try {
      await sock.groupParticipantsUpdate(groupId, [targetJid], "add");
      await sock.sendMessage(groupId, {
        text: `✅ @${targetJid.split("@")[0]} foi reintegrado.`,
        mentions: [targetJid],
      });
    } catch {
      await sock.sendMessage(groupId, {
        text: `Não foi possível readicionar @${targetJid.split("@")[0]}.`,
        mentions: [targetJid],
      });
    }
  }

  // Remove a sessão após uso
  buttonSessions.delete(messageId);
});
