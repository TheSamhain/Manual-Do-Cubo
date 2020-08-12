import React from 'react';
import RandomCubeGif from '../../assets/img/RandomCube.gif';
import './Erro.css'

function Erro({ erro }) {
  return (
    <div className="erroMain">
      <img src={RandomCubeGif} alt="Loader" className="RandomCubeGif" />
      <h1>{erro}</h1>
    </div>
  );
}

export default Erro;
