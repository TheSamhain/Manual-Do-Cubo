import React from 'react';
import PageDefault from '../../components/PageDefault';
import IconError from '../../assets/img/cube-broken.png';
import './error404.css';

const ErrorPage = () => (
  <PageDefault>
    <div className="page-error">
      <h1>
        Oh não, esta página não existe
        <span role="img" aria-labelledby="Carinha de triste">😔</span>
      </h1>
      <img src={IconError} alt="Icone de Erro" width="200px" />
    </div>

  </PageDefault>
);

export default ErrorPage;
