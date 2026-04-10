import { PREFIX } from "../../config.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  name: "projeto",
  description: "Boot screen estilo hacker",
  commands: ["projeto"],
  usage: `${PREFIX}projeto`,

  handle: async (ctx) => {
    const sock = ctx.sock || ctx.client;
    const jid = ctx.jid || ctx.chat || ctx.from;

    if (!sock) return;

    await sock.sendMessage(jid, { text: "⚙️ iniciando sistema..." });

    await sleep(800);
    await sock.sendMessage(jid, { text: "╔═⚙️ BOOT SEQUENCE START ═╗" });

    await sleep(900);
    await sock.sendMessage(jid, {
      text: "🔌 conectando engrenagens... [OK]",
    });

    await sleep(900);
    await sock.sendMessage(jid, {
      text: "🌐 sincronizando rede global... [OK]",
    });

    await sleep(900);
    await sock.sendMessage(jid, {
      text: "👑 DEV GUI initialized (ROOT ACCESS)",
    });

    await sleep(900);
    await sock.sendMessage(jid, {
      text:
        "🤝 MRX • MKG • NVPanda • Val Dead • SAMA\n⚙️ contributors linked...",
    });

    await sleep(900);
    await sock.sendMessage(jid, {
      text:
        "📦 REPOS:\n" +
        "• https://github.com/guiireal/takeshi-bot.git\n" +
        "• https://github.com/Dark-Shadoww/takeshi-bot\n" +
        "• https://github.com/NVPanda/pandabot-typescript\n" +
        "• https://github.com/valeriajf/DeadBoT-\n" +
        "• https://github.com/RafaelQuadros1/sam-bot\n" +
        "• https://github.com/Z3phyrkkj",
    });

    await sleep(1000);
    await sock.sendMessage(jid, {
      text: `
╔═⚙️〔 SYSTEM ONLINE 〕⚙️═╗
║ TAKESHI NETWORK ACTIVE
║ COLLAB MODE: ENABLED
╚═⚙️═══════════════════⚙️═╝

🚀 welcome to the grid
      `,
    });
  },
};

// import { PREFIX } from "../../config.js";

// export default {
//   name: "projeto",
//   description: "Informações sobre o projeto",
//   commands: ["projeto"],
//   usage: `${PREFIX}projeto`,

//   handle: async (ctx) => {
//     const sock = ctx.sock || ctx.client || ctx.connection;
//     const jid = ctx.jid || ctx.chat || ctx.from;

//     const message = `
// ╔═⚙️〔 TAKESHI://NETWORK 〕⚙️═╗
// ║ 👑 DEV GUI (Founder/Mentor)
// ║ 🤝 MRX • MKG • NVPanda • Val Dead • SAMA
// ╚═⚙️════════════════════⚙️═╝

// ⚙️ REPOSITORIES CORE
// • https://github.com/guiireal/takeshi-bot.git
// • https://github.com/Dark-Shadoww/takeshi-bot
// • https://github.com/NVPanda/pandabot-typescript
// • https://github.com/valeriajf/DeadBoT-
// • https://github.com/RafaelQuadros1/sam-bot
// • https://github.com/Z3phyrkkj

// 💡 STATUS: COLLAB ACTIVE
// ⚙️ Engines synchronized across forks
// 🚀 JOIN THE GRID
// `;

//     if (!sock) return;

//     await sock.sendMessage(jid, { text: message });
//   },
// };


// import { PREFIX } from "../../config.js";

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// export default {
//   name: "projeto",
//   description: "Boot screen estilo hacker",
//   commands: ["projeto"],
//   usage: `${PREFIX}projeto`,

//   handle: async (ctx) => {
//     const sock = ctx.sock || ctx.client;
//     const jid = ctx.jid || ctx.chat || ctx.from;

//     if (!sock) return;

//     await sock.sendMessage(jid, { text: "⚙️ iniciando sistema..." });

//     await sleep(800);
//     await sock.sendMessage(jid, { text: "╔═⚙️ BOOT SEQUENCE START ═╗" });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "🔌 conectando engrenagens... [OK]",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "🌐 sincronizando rede global... [OK]",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "👑 DEV GUI initialized (ROOT ACCESS)",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text:
//         "🤝 MRX • MKG • NVPanda • Val Dead • SAMA\n⚙️ contributors linked...",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text:
//         "📦 REPOS:\n" +
//         "• https://github.com/guiireal/takeshi-bot.git\n" +
//         "• https://github.com/Dark-Shadoww/takeshi-bot\n" +
//         "• https://github.com/NVPanda/pandabot-typescript\n" +
//         "• https://github.com/valeriajf/DeadBoT-\n" +
//         "• https://github.com/RafaelQuadros1/sam-bot\n" +
//         "• https://github.com/Z3phyrkkj",
//     });

//     await sleep(1000);
//     await sock.sendMessage(jid, {
//       text: `
// ╔═⚙️〔 SYSTEM ONLINE 〕⚙️═╗
// ║ TAKESHI NETWORK ACTIVE
// ║ COLLAB MODE: ENABLED
// ╚═⚙️═══════════════════⚙️═╝

// 🚀 welcome to the grid
//       `,
//     });
//   },
// };

// import { PREFIX } from "../../config.js";

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// export default {
//   name: "projeto",
//   description: "Boot screen estilo hacker",
//   commands: ["projeto"],
//   usage: `${PREFIX}projeto`,

//   handle: async (ctx) => {
//     const sock = ctx.sock || ctx.client;
//     const jid = ctx.jid || ctx.chat || ctx.from;

//     if (!sock) return;

//     await sock.sendMessage(jid, { text: "⚙️ iniciando sistema..." });

//     await sleep(800);
//     await sock.sendMessage(jid, { text: "╔═⚙️ BOOT SEQUENCE START ═╗" });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "🔌 conectando engrenagens... [OK]",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "🌐 sincronizando rede global... [OK]",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text: "👑 DEV GUI initialized (ROOT ACCESS)",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text:
//         "🤝 MRX • MKG • NVPanda • Val Dead • SAMA\n⚙️ contributors linked...",
//     });

//     await sleep(900);
//     await sock.sendMessage(jid, {
//       text:
//         "📦 REPOS:\n" +
//         "• https://github.com/guiireal/takeshi-bot.git\n" +
//         "• https://github.com/Dark-Shadoww/takeshi-bot\n" +
//         "• https://github.com/NVPanda/pandabot-typescript\n" +
//         "• https://github.com/valeriajf/DeadBoT-\n" +
//         "• https://github.com/RafaelQuadros1/sam-bot\n" +
//         "• https://github.com/Z3phyrkkj",
//     });

//     await sleep(1000);
//     await sock.sendMessage(jid, {
//       text: `
// ╔═⚙️〔 SYSTEM ONLINE 〕⚙️═╗
// ║ TAKESHI NETWORK ACTIVE
// ║ COLLAB MODE: ENABLED
// ╚═⚙️═══════════════════⚙️═╝

// 🚀 welcome to the grid
//       `,
//     });
//   },
// };