const { PREFIX } = require(`${BASE_DIR}/config`);
const fs = require("fs");

// Listas simuladas (use seu banco de dados real)
const owners = ["558199999999@c.us"]; // Número do dono
const vipUsers = ["558188888888@c.us"]; // VIPs

module.exports = {
  name: "ban",
  description: "Bane um usuário do grupo",
  commands: ["ban"],
  usage: `${PREFIX}ban @usuário`,
  handle: async ({ sock, m, command, args, isAdmin, isGroup, groupMetadata, sender }) => {
    try {
      if (!isGroup) return await sock.sendMessage(m.chat, { text: "Este comando só pode ser usado em grupos." });

      const isOwner = owners.includes(sender);
      if (!isOwner && !isAdmin) {
        return await sock.sendMessage(m.chat, { text: "Apenas administradores ou o dono podem usar este comando." });
      }

      const mentionedJid = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!mentionedJid) return await sock.sendMessage(m.chat, { text: "Marque o usuário que deseja banir." });

      const userIsOwner = owners.includes(mentionedJid);
      const userIsVip = vipUsers.includes(mentionedJid);

      if (!isOwner && userIsOwner) {
        return await sock.sendMessage(m.chat, { text: "Você não pode banir o dono do bot." });
      }

      if (!isOwner && userIsVip) {
        return await sock.sendMessage(m.chat, { text: "Este usuário é VIP e não pode ser banido por admins." });
      }

      const groupAdmins = groupMetadata.participants.filter(p => p.admin);
      const isTargetAdmin = groupAdmins.find(p => p.id === mentionedJid);

      if (isTargetAdmin && !isOwner) {
        return await sock.sendMessage(m.chat, { text: "Você não pode banir outro administrador." });
      }

      await sock.groupParticipantsUpdate(m.chat, [mentionedJid], "remove");
      await sock.sendMessage(m.chat, { text: `Usuário banido com sucesso.` });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(m.chat, { text: "Ocorreu um erro ao tentar banir o usuário." });
    }
  },
};
