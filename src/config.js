import path from "node:path";
import { fileURLToPath } from "node:url";
import load_dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefixo padrão dos comandos.
<<<<<<< HEAD
export const PREFIX = "/";

// Emoji do bot (mude se preferir).
export const BOT_EMOJI = "🤖";

// Nome do bot (mude se preferir).
export const BOT_NAME = "Autobot Panda";

// LID do bot.
// Para obter o LID do bot, use o comando <prefixo>lid respondendo em cima de uma mensagem do número do bot
// Troque o <prefixo> pelo prefixo do bot (ex: /lid).
export const BOT_LID = "12345678901234567890@lid";

// LID do dono do bot.
// Para obter o LID do dono do bot, use o comando <prefixo>meu-lid
// Troque o <prefixo> pelo prefixo do bot (ex: /meu-lid).
export const OWNER_LID = "200712562700474@lid";
=======
exports.PREFIX = "•";

// Emoji do bot (mude se preferir).
exports.BOT_EMOJI = "🐼";

// Nome do bot (mude se preferir).
exports.BOT_NAME = "🛠️ Steampunk Panda";

// Número do bot.
// Apenas números, exatamente como está no WhatsApp.
// Se o seu número não exibir o nono dígito (9) no WhatsApp, não coloque-o.
exports.BOT_NUMBER = "558198063289";

// Número do dono bot.
// Apenas números, exatamente como está no WhatsApp.
// Se o seu número não exibir o nono dígito (9) no WhatsApp, não coloque-o.
exports.OWNER_NUMBER = "5581998063289";

// LID do dono do bot.
// Para obter o LID do dono do bot, use o comando <prefixo>get-lid @marca ou +telefone do dono.
exports.OWNER_LID = "200712562700474@lid";
>>>>>>> e1e28f2e2300267f7948a03b8f086e46b38b8bb5

// Diretório dos comandos
export const COMMANDS_DIR = path.join(__dirname, "commands");

// Diretório de arquivos de mídia.
export const DATABASE_DIR = path.resolve(__dirname, "..", "database");

// Diretório de arquivos de mídia.
export const ASSETS_DIR = path.resolve(__dirname, "..", "assets");

// Diretório de arquivos temporários.
export const TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

// Timeout em milissegundos por evento (evita banimento).
export const TIMEOUT_IN_MILLISECONDS_BY_EVENT = 1000;

// Plataforma de API's
export const SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api";

// Obtenha seu token, criando uma conta em: https://api.spiderx.com.br.
<<<<<<< HEAD
export const SPIDER_API_TOKEN = "SPIDER_TOKEN";

// Plataforma de geração de links a partir de imagens
export const LINKER_BASE_URL = "https://linker.devgui.dev/api";

// Obtenha sua chave em: https://linker.devgui.dev.
export const LINKER_API_KEY = "seu_token_aqui";
=======
exports.SPIDER_API_TOKEN = "KcDQFpsSSfB8euRiJDUs";
exports.OPENAI_API_KEY = "";
exports.GROK_API_KEY = "";
exports.GEMINI_API_KEY = "";
exports.ANTHROPIC_API_KEY = "";
exports.PIXABAY_API_KEY = "";
>>>>>>> e1e28f2e2300267f7948a03b8f086e46b38b8bb5

// Caso queira responder apenas um grupo específico,
// coloque o ID dele na configuração abaixo.
// Para saber o ID do grupo, use o comando <prefixo>get-group-id
// Troque o <prefixo> pelo prefixo do bot (ex: /get-group-id).
export const ONLY_GROUP_ID = "120363425395533898@g.us";

// Configuração para modo de desenvolvimento
// mude o valor para ( true ) sem os parênteses
// caso queira ver os logs de mensagens recebidas
export const DEVELOPER_MODE = false;

// Caso queira usar proxy.
export const PROXY_PROTOCOL = "https";
export const PROXY_HOST = "";
export const PROXY_PORT = "";
export const PROXY_USERNAME = "";
export const PROXY_PASSWORD = "";

// Versão do WhatsApp Web
export const WAWEB_VERSION = [2, 3000, 1035691214];

// Chave da OpenAI para o comando de suporte
export const OPENAI_API_KEY = "";
