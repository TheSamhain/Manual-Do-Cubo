import styled from 'styled-components';

const VideoCardContainer = styled.button`
  border: 2px solid;
  border-radius: 4px;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
  color: white;
  flex: 0 0 298px;
  width: 298px;
  height: 197px;
  background-image: ${({ url }) => `url(${url})`};
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 0;
  transition: opacity .3s;
  &:hover,
  &:focus {
    opacity: .5;
  }
  
  &:not(:first-child) {
    margin-left: 20px;
  }
`;

const VideoCardTitle = styled.p`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  padding: 3px;
  font-size: 1.1em
`;

export { VideoCardContainer, VideoCardTitle };
