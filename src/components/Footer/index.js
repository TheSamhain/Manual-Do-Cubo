import React from 'react';
import { Link } from 'react-router-dom';
import { FooterBase, FooterLine } from './styles';
import LogoFooter from '../../assets/img/IconCube.png';

function Footer() {
  return (
    <FooterBase>
      <Link to="/">
        <img src={LogoFooter} alt="Logo Footer" width="100px" />
      </Link>

      <FooterLine>
        <a href="https://br.linkedin.com/in/leonardo-noro-pereira">
          <i className="bi bi-linkedin" />
          Leonardo Noro Pereira
        </a>

        <div>
          Desenvolvido por&nbsp;
          <b>Leonardo Noro Pereira</b>
        </div>

        <a href="https://github.com/TheSamhain">
          <i className="bi bi-github" />
          TheSamhain
        </a>
      </FooterLine>
    </FooterBase>
  );
}

export default Footer;
