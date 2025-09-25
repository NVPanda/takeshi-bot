/**
 * Interceptadores diversos.
 *
 * @author Dev Gui
 */
const { OWNER_NUMBER, OWNER_LID } = require("../config");
const { compareUserJidWithOtherNumber } = require("../utils");
const { getPrefix } = require("../utils/database");

exports.verifyPrefix = (prefix, groupJid) => {
  const groupPrefix = getPrefix(groupJid);

  return groupPrefix === prefix;
};

exports.hasTypeAndCommand = ({ type, command }) => !!type && !!command;

exports.isLink = (text) => {
  const cleanText = text.trim();

  if (/^\d+$/.test(cleanText)) {
    return false;
  }

  if (/[.]{2,3}/.test(cleanText)) {
    return false;
  }

  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (ipPattern.test(cleanText.split("/")[0])) {
    return true;
  }

  const urlPattern =
    /(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/[^\s]*)?/g;

  const matches = cleanText.match(urlPattern);

  if (!matches || matches.length === 0) {
    return false;
  }

  const fileExtensions =
    /\.(txt|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|exe|jpg|jpeg|png|gif|mp4|mp3|avi)$/i;

  return matches.some((match) => {
    const cleanMatch = match.replace(/^https?:\/\//, "").replace(/^www\./, "");

    const matchIndex = cleanText.indexOf(match);
    const beforeMatch = cleanText.substring(0, matchIndex);
    const afterMatch = cleanText.substring(matchIndex + match.length);

    const charBefore = beforeMatch.slice(-1);
    const charAfter = afterMatch.slice(0, 1);

    if (
      charBefore &&
      /[a-zA-Z0-9]/.test(charBefore) &&
      !/[\s\.\,\:\;\!\?\(\)\[\]\{\}]/.test(charBefore)
    ) {
      return false;
    }

    if (
      charAfter &&
      /[a-zA-Z0-9]/.test(charAfter) &&
      !/[\s\.\,\:\;\!\?\(\)\[\]\{\}\/]/.test(charAfter)
    ) {
      return false;
    }

    if (/\s/.test(cleanMatch)) {
      return false;
    }

    if (fileExtensions.test(cleanMatch)) {
      return false;
    }

    const domainPart = cleanMatch.split("/")[0];
    if (domainPart.split(".").length < 2) {
      return false;
    }

    const parts = domainPart.split(".");
    const extension = parts[parts.length - 1];
    if (extension.length < 2) {
      return false;
    }

    try {
      const url = new URL("https://" + cleanMatch);
      return url.hostname.includes(".") && url.hostname.length > 4;
    } catch {
      return false;
    }
  });
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
    compareUserJidWithOtherNumber({
      userJid: participant.id,
      otherNumber: OWNER_NUMBER,
    });

  const isAdmin = participant.admin === "admin";

  return isOwner || isAdmin;
};


exports.isBotOwner = ({ userJid, isLid }) => {
  if (isLid) {
    return userJid === OWNER_LID;
  }

  return compareUserJidWithOtherNumber({
    userJid: userJid,
    otherNumber: OWNER_NUMBER,
  });
};

exports.checkPermission = async ({ type, socket, userJid, remoteJid }) => {
  if (type === "member") {
    return true;
  }

  try {
    const { participants, owner } = await socket.groupMetadata(remoteJid);

    const participant = participants.find(
      (participant) => participant.id === userJid
    );

    if (!participant) {
      return false;
    }

    const isOwner =
      participant.id === owner || participant.admin === "superadmin";

    const isAdmin = participant.admin === "admin";

    const isBotOwner =
      compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER }) ||
      userJid === OWNER_LID;

    if (type === "admin") {
      return isOwner || isAdmin || isBotOwner;
    }

    if (type === "owner") {
      return isOwner || isBotOwner;
    }

    return false;
  } catch (error) {
    return false;
  }
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

