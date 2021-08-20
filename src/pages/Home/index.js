import React, { useEffect, useState } from 'react';
import Carousel from '../../components/Carousel';
import BannerMain from '../../components/BannerMain';
import PageDefault from '../../components/PageDefault';
import Loader from '../../components/Loader';
import Erro from '../../components/Erro';
import DB from '../../data/db.json';

function Home() {
  const [dados, setDados] = useState([]);
  const [erroRequisicao, setErroRequisicao] = useState();

  useEffect(() => {
    if (!DB.categorias || DB.categorias.length === 0) {
      setErroRequisicao('Não foi possível carregar os videos')
    } else {
      setDados(DB.categorias);
    }
  }, []);

  return (
    <PageDefault paddingAll={0}>

      {(dados.length === 0) && <Loader />}

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
