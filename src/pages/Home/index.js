import React from 'react';
import Menu from '../../components/Menu';
import Carousel from '../../components/Carousel';
import Footer from '../../components/Footer';
import BannerMain from '../../components/BannerMain';
import dadosIniciais from '../../data/dados_iniciais.json';

function Home() {
  return (
    <div style={{ background: '#141414' }}>
      <Menu />

      <BannerMain
        videoTiyle={dadosIniciais.categorias[0].videos[0].titulo}
        url={dadosIniciais.categorias[0].videos[0].url}
        videoDescription="Alguma descrição aqui para exibir no vídeo principal que mostra na página de teste"
      />

      {dadosIniciais.categorias.map((categoria) => (
        <Carousel
          ignoreFirstVideo
          category={categoria}
        />
      ))}

      <Footer />
    </div>
  );
}

export default Home;
