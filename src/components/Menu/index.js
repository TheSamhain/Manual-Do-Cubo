import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/Logo.png';
import './Menu.css';

function Menu() {
  window.onscroll = () => {
    const currentScrollPos = window.pageYOffset;
    const menuHeight = document.getElementById('menu').offsetHeight;

    if (currentScrollPos < menuHeight) {
      document.getElementById('menu').style.top = '0';
    } else {
      document.getElementById('menu').style.top = `-${menuHeight}px`;
    }
  };

  return (
    <nav id="menu">
      <Link to="/">
        <img className="Logo" src={Logo} alt="ManualDoCubo Logo" border="0" />
      </Link>
    </nav>
  );
}

export default Menu;
