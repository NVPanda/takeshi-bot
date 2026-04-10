const { PREFIX } = require(`${BASE_DIR}/config`);
const fs = require("fs");

const owners = ["558199999999@c.us"];
const vipUsers = ["558188888888@c.us"];
const buttonSessions = new Map(); // Sessões em memória

module.exports = {
  name: "bancontrol",
  description: "Banir ou desbanir usuários com botões",
  commands: ["bancontrol"],
  usage: `${PREFIX}bancontrol @usuário`,
  handle: async ({ sock, m, isAdmin, isGroup, groupMetadata, sender }) => {
    try {
      if (!isGroup) return sock.sendMessage(m.chat, { text: "Este comando só funciona em grupos." });

      const isOwner = owners.includes(sender);
      if (!isOwner && !isAdmin) {
        return sock.sendMessage(m.chat, { text: "Apenas administradores ou o dono podem usar este comando." });
      }

      const mentionedJid = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!mentionedJid) {
        return sock.sendMessage(m.chat, { text: "Marque um usuário para aplicar a ação." });
      }

      const userIsOwner = owners.includes(mentionedJid);
      const userIsVip = vipUsers.includes(mentionedJid);
      const groupAdmins = groupMetadata.participants.filter(p => p.admin);
      const isTargetAdmin = groupAdmins.find(p => p.id === mentionedJid);

      if (!isOwner && userIsOwner) return sock.sendMessage(m.chat, { text: "Você não pode banir o dono do bot." });
      if (!isOwner && userIsVip) return sock.sendMessage(m.chat, { text: "Este usuário é VIP e não pode ser banido." });
      if (!isOwner && isTargetAdmin) return sock.sendMessage(m.chat, { text: "Você não pode banir outro administrador." });

      const number = mentionedJid.split("@")[0];
      const buttons = [
        { buttonId: `ban::${mentionedJid}`, buttonText: { displayText: "🚫 Banir" }, type: 1 },
        { buttonId: `unban::${mentionedJid}`, buttonText: { displayText: "✅ Reintegrar" }, type: 1 },
      ];

      const sentMsg = await sock.sendMessage(m.chat, {
        text: `O que deseja fazer com @${number}?`,
        footer: "Apenas você pode interagir com os botões.",
        buttons,
        headerType: 1,
        mentions: [mentionedJid],
      });

      // Salva a sessão da mensagem
      buttonSessions.set(sentMsg.key.id, {
        owner: sender,
        target: mentionedJid,
        timestamp: Date.now(),
        group: m.chat,
      });

    } catch (err) {
      console.error(err);
      sock.sendMessage(m.chat, { text: "Erro ao processar comando." });
    }
  },
  // Exporta sessão para uso externo
  sessions: buttonSessions,
};
