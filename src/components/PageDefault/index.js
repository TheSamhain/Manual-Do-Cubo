/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Footer from '../Footer';
import Menu from '../Menu';

const Main = styled.main`
  background-color: var(--black);
  color: var(--white);
  flex: 1;
  
  padding-top: 50px;
  padding-left: 5%;
  padding-right: 5%;

  ${({ paddingAll }) => css`
    padding: ${paddingAll};
  `}
`;

function PageDefault({ children, paddingAll }) {
  return (
    <>
      <Menu />
      <Main paddingAll={paddingAll}>
        {children}
      </Main>
      <Footer />
    </>
  );
}

PageDefault.defaultProps = {
  children: []
}

PageDefault.propTypes = {
  children: PropTypes.array,
  paddingAll: PropTypes.number.isRequired,
};

export default PageDefault;
