/**
 * Evento chamado quando uma mensagem
 * é enviada para o grupo do WhatsApp
 *
 * @author Dev Gui
 */
const {
  isAtLeastMinutesInPast,
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAddOrLeave,
} = require("../utils");
const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { onGroupParticipantsUpdate } = require("./onGroupParticipantsUpdate");

exports.onMessagesUpsert = async ({ socket, messages, groupCache }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    const timestamp = webMessage.messageTimestamp;

    if (isAtLeastMinutesInPast(timestamp)) {
      continue;
    }

    if (isAddOrLeave.includes(webMessage.messageStubType)) {
      let action = "";
      if (webMessage.messageStubType === GROUP_PARTICIPANT_ADD) {
        action = "add";
      } else if (webMessage.messageStubType === GROUP_PARTICIPANT_LEAVE) {
        action = "remove";
      }

      onGroupParticipantsUpdate({
        userJid: webMessage.messageStubParameters[0],
        remoteJid: webMessage.key.remoteJid,
        socket,
        groupCache,
        action,
      });
    } else {
      const commonFunctions = loadCommonFunctions({ socket, webMessage });

      if (!commonFunctions) {
        continue;
      }

      await dynamicCommand(commonFunctions);
    }

    const antiCloneMiddleware = require('./middleware/antiClone');

    sock.ev.on("messages.upsert", async ({ messages }) => {
      const m = messages[0];
      if (!m.message) return;

      const sender = m.key.participant || m.key.remoteJid;
      const isGroup = m.key.remoteJid.endsWith("@g.us");

      const groupMetadata = isGroup ? await sock.groupMetadata(m.key.remoteJid) : null;

      await antiCloneMiddleware({ sock, m, isGroup, sender, groupMetadata });

    });

  }
};
