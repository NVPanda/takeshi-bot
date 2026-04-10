const { PREFIX, ANTHROPIC_API_KEY } = require(`${BASE_DIR}/config`);
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

module.exports = {
  name: "claude",
  description: "Pergunta algo ao Claude com contexto da web",
  commands: ["claude", "cld"],
  usage: `${PREFIX}claude <sua pergunta>`,
  handle: async ({ args, send }) => {
    if (!args.length) {
      await send(`Uso: ${this.usage}`);
      return;
    }

    try {
      // Simula acesso à internet com uma busca
      const query = args.join(' ');
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const searchResponse = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      // Extrai um trecho do resultado
      const webContext = searchResponse.data.slice(0, 500);

      const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [{ role: "user", content: `Contexto da web: ${webContext}\n\nPergunta: ${query}` }],
      });

      await send(msg.content[0].text);
    } catch (error) {
      console.error('Erro no Claude:', error);
      await send('Erro ao consultar o Claude. Verifique a chave da API ou conexão.');
    }
  },
};