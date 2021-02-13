import URL_DB from '../config';

const URL_VIDEOS = `${URL_DB}/videos`;

function create(videoObject) {
  return fetch(`${URL_VIDEOS}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(videoObject),
  })
    .then(async (respostaServidor) => {
      if (respostaServidor.ok) {
        const resposta = await respostaServidor.json();
        return resposta;
      }

      throw new Error('Não foi possível pegar os dados :(');
    });
}

export default {
  create,
};
