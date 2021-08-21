/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { VideoCardContainer, VideoCardTitle } from './styles';

function getYouTubeId(youtubeURL) {
  return youtubeURL
    .replace(
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
      '$7',
    );
}

function VideoCard({ video, categoryColor, setSelectedVideo }) {
  const image = `https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`;
  return (
    <VideoCardContainer
      url={image}
      setSelectedVideo={setSelectedVideo}
      style={{ borderColor: categoryColor || 'red' }}
      title={video.titulo}
      onClick={() => setSelectedVideo(video)}
    >
      <VideoCardTitle>{video.titulo}</VideoCardTitle>
    </VideoCardContainer>
  );
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  categoryColor: PropTypes.string.isRequired,
  setSelectedVideo: PropTypes.any.isRequired,
};

export default VideoCard;
