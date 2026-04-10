const { PREFIX, GEMINI_API_KEY } = require(`${BASE_DIR}/config`);
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

module.exports = {
  name: "gemini",
  description: "Pergunta algo ao Gemini com contexto da web",
  commands: ["gemini", "gm"],
  usage: `${PREFIX}gemini <sua pergunta>`,
  handle: async ({ args, send }) => {
    if (!args.length) {
      await send(`Uso: ${this.usage}`);
      return;
    }

    try {
      // Simula acesso à internet com uma busca simples
      const query = args.join(' ');
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const searchResponse = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      // Extrai um trecho do resultado (simplificado)
      const webContext = searchResponse.data.slice(0, 500);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Contexto da web: ${webContext}\n\nPergunta do usuário: ${query}`;
      const result = await model.generateContent(prompt);

      await send(result.response.text());
    } catch (error) {
      console.error('Erro no Gemini:', error);
      await send('Erro ao consultar o Gemini. Verifique a chave da API ou conexão.');
    }
  },
};