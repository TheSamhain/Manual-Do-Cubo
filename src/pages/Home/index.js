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
  const [selectedVideo, setSelectedVideo] = useState({});

  useEffect(() => {
    if (!DB.categorias || DB.categorias.length === 0) {
      setErroRequisicao('Não foi possível carregar os videos');
    } else {
      setDados(DB.categorias);
      setSelectedVideo(DB.categorias[0].videos[0]);

      const lastVideo = localStorage.getItem('selectedVideo');

      if (lastVideo) {
        setSelectedVideo(JSON.parse(lastVideo));
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (Object.prototype.hasOwnProperty.call(selectedVideo, 'id')) {
      localStorage.setItem('selectedVideo', JSON.stringify(selectedVideo));
    }
  }, [selectedVideo]);

  return (
    <PageDefault paddingAll={0}>

      {(dados.length === 0) && <Loader />}

      {(dados.length > 0) && (
        <>
          <BannerMain
            videoTiyle={selectedVideo.titulo}
            url={selectedVideo.url}
            videoDescription={dados[0].descricao}
          />

          {dados.map((categoria) => (
            <Carousel
              key={categoria.id}
              ignoreFirstVideo={false}
              category={categoria}
              setSelectedVideo={setSelectedVideo}
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
