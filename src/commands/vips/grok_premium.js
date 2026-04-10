const { PREFIX, GROK_API_KEY } = require(`${BASE_DIR}/config`);
const axios = require('axios');

module.exports = {
  name: "grok",
  description: "Pergunta algo ao Grok com contexto da web",
  commands: ["grok", "grk"],
  usage: `${PREFIX}grok <sua pergunta>`,
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

      // Chama a API do Grok (endpoint fictício, substitua pelo real conforme https://x.ai/api)
      const response = await axios.post(
        'https://api.x.ai/grok/v1/completions',
        {
          model: 'grok',
          prompt: `Contexto da web: ${webContext}\n\nPergunta: ${query}`,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${GROK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await send(response.data.choices[0].text);
    } catch (error) {
      console.error('Erro no Grok:', error);
      await send('Erro ao consultar o Grok. Verifique a chave da API ou conexão. Mais detalhes: https://x.ai/api');
    }
  },
};