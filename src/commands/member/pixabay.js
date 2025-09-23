const { PREFIX } = require(`${BASE_DIR}/config`);
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: "pixabay",
  description: "Busca uma imagem ou vídeo aleatório no Pixabay com base em uma query",
  commands: ["pixabay", "px"],
  usage: `${PREFIX}pixabay <termo de busca>`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendAudioFromBuffer, send }) => {
    // Verifica se o usuário forneceu um termo de busca
    if (!args.length) {
      await send(`Por favor, forneça um termo de busca. Uso: ${this.usage}`);
      return;
    }

    const query = args.join('+');
    const searchUrl = `https://pixabay.com/pt/images/search/${encodeURIComponent(query)}/`;

    try {
      // Faz a requisição para a página de busca do Pixabay
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Carrega o HTML com cheerio
      const $ = cheerio.load(response.data);

      // Extrai URLs de imagens e vídeos
      const mediaItems = [];
      $('img[src*="pixabay.com"]').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && !src.includes('static.pixabay.com')) {
          mediaItems.push({ type: 'image', url: src });
        }
      });
      $('video source[src*="pixabay.com"]').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src) {
          mediaItems.push({ type: 'video', url: src });
        }
      });

      // Verifica se encontrou algum item
      if (!mediaItems.length) {
        await send('Nenhum resultado encontrado para a busca.');
        return;
      }

      // Seleciona um item aleatoriamente
      const randomItem = mediaItems[Math.floor(Math.random() * mediaItems.length)];

      // Faz o download do item como buffer
      const mediaResponse = await axios.get(randomItem.url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const buffer = Buffer.from(mediaResponse.data);

      // Envia o arquivo com base no tipo
      if (randomItem.type === 'image') {
        // Como sendAudioFromBuffer é fornecido, presumimos que há um método semelhante para imagens
        await sendAudioFromBuffer(buffer, 'image.jpg');
      } else if (randomItem.type === 'video') {
        await sendAudioFromBuffer(buffer, 'video.mp4');
      }

      await send(`Enviado ${randomItem.type} de "${args.join(' ')}" do Pixabay!`);
    } catch (error) {
      console.error('Erro ao buscar no Pixabay:', error);
      await send('Ocorreu um erro ao buscar o conteúdo no Pixabay.');
    }
  },
};