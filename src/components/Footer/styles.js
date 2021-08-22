import styled from 'styled-components';

const FooterBase = styled.footer`
  background: var(--black);
  border-top: 2px solid var(--primary);
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 32px;
  padding-bottom: 32px;
  color: var(--white);
  text-align: center;
`;

const FooterLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;

  > * {
    flex: 1;
  }

  > *:first-child{
    text-align: left;
  }

  > *:last-child{
    text-align: right;
  }


  @media (max-width: 768px) {
    flex-direction: column;

    > * {
      margin: 10px 0px;
      order: 3;
    }
    
    > *:first-child{
      text-align: center;
    }
   
    > *:last-child{
      text-align: center;
    }

    > div {
      order: 1;
      display: flex;
      flex-direction: column;
    }

  }
`;

export { FooterBase, FooterLine };
