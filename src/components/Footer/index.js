import React from 'react';
import { FooterBase, FooterLine } from './styles';
import LogoFooter from '../../assets/img/IconCube.png';

function Footer() {
  return (
    <FooterBase>
      <a href="/#" className="footer-logo">
        <img src={LogoFooter} alt="Logo Footer" width="100px" />
      </a>

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
