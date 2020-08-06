import React from 'react';
import { VideoCardContainer } from './styles';
import PropTypes from 'prop-types';

function getYouTubeId(youtubeURL) {
  return youtubeURL
    .replace(
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
      '$7',
    );
}

function VideoCard({ videoTitle, videoURL, categoryColor }) {
  const image = `https://img.youtube.com/vi/${getYouTubeId(videoURL)}/hqdefault.jpg`;
  return (
    <VideoCardContainer
      url={image}
      href={videoURL}
      target="_blank"
      style={{ borderColor: categoryColor || 'red' }}
      title={videoTitle}
    />
  );
}

VideoCard.prototype = {
  videoTitle: PropTypes.string.isRequired, 
  videoURL: PropTypes.string.isRequired, 
  categoryColor: PropTypes.string.isRequired
}

export default VideoCard;
