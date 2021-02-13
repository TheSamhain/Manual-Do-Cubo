import React, { useEffect, useState } from 'react';
import Carousel from '../../components/Carousel';
import BannerMain from '../../components/BannerMain';
import PageDefault from '../../components/PageDefault';

import categoriasRepository from '../../repositories/categorias';
import Loader from '../../components/Loader';
import Erro from '../../components/Erro';

function Home() {
  const [dados, setDados] = useState([]);
  const [erroRequisicao, setErroRequisicao] = useState();

  useEffect(() => {
    categoriasRepository.getAllWithVideos()
      .then((categoriasComVideos) => {
        setDados(categoriasComVideos);
      })
      .catch((err) => {
        setDados({
          categorias: [],
        });
        setErroRequisicao(err.message);
      });
  }, []);

  return (
    <PageDefault paddingAll={0}>

      {(dados.length === 0) && <Loader /> }

      {(dados.length > 0) && (
        <>
          <BannerMain
            videoTiyle={dados[0].videos[0].titulo}
            url={dados[0].videos[0].url}
            videoDescription={dados[0].descricao}
          />

          {dados.map((categoria) => (
            <Carousel
              key={categoria.id}
              ignoreFirstVideo={categoria.id === 1}
              category={categoria}
            />
          ))}
        </>
      )}

      {erroRequisicao && (
      <Erro erro={erroRequisicao} />
      )}

    </PageDefault>
  );
}

export default Home;
