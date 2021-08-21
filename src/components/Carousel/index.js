/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { VideoCardGroupContainer, Title } from './styles';
import Slider, { SliderItem } from './components/Slider';
import VideoCard from './components/VideoCard';

function Carousel({ ignoreFirstVideo, category, setSelectedVideo,
}) {
  const categoryTitle = category.titulo;
  const categoryColor = category.cor;
  const { videos } = category;
  return (
    <VideoCardGroupContainer>
      {categoryTitle && (
        <>
          <Title style={{ backgroundColor: categoryColor || 'red' }}>
            {categoryTitle}
          </Title>
        </>
      )}
      <Slider>
        {videos.map((video, index) => {
          if (ignoreFirstVideo && index === 0) {
            return null;
          }

          return (
            <SliderItem key={video.titulo}>
              <VideoCard
                video={video}
                categoryColor={categoryColor}
                setSelectedVideo={setSelectedVideo}
              />
            </SliderItem>
          );
        })}
      </Slider>
    </VideoCardGroupContainer>
  );
}

Carousel.defaultProps = {
  ignoreFirstVideo: false,
};

Carousel.propTypes = {
  ignoreFirstVideo: PropTypes.bool,
};

export default Carousel;
