import React from 'react';
import { Link } from 'react-router-dom';
import { FooterBase } from './styles';
import LogoFooter from '../../assets/img/LogoFooter.png';

function Footer() {
  return (
    <FooterBase>
      <Link to="/">
        <img src={LogoFooter} alt="Logo Footer" width="100px" />
      </Link>
      <p>
        Orgulhosamente criado durante a
        {' '}
        <a href="https://www.alura.com.br/">
          Imersão React da Alura
        </a>
      </p>
    </FooterBase>
  );
}

export default Footer;
