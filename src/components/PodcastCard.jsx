import React from 'react';

const PodcastCard = ({ podcast, listenedEpisodes, handlePodcastClick, toggleFavorite, audioRef, handleAudioEnded, favorites }) => (
  <div
    key={podcast.id}
    className={`podcast-card ${listenedEpisodes.includes(podcast.id) ? 'listened' : ''}`}
    onClick={() => handlePodcastClick(podcast)}
  >
    {podcast.image && (
      <img src={podcast.image} alt={podcast.title} />
    )}
    <h2>{podcast.title}</h2>
    <p>Seasons: {podcast.seasons.join(', ')}</p>
    <p>Updated: {formatDate(podcast.updated)}</p>
    <audio ref={audioRef} controls onEnded={() => handleAudioEnded(podcast.id)}>
      <source src={podcast.audio} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <button onClick={() => toggleFavorite(podcast.id)}>
      {favorites.includes(podcast.id) ? 'Unfavorite' : 'Favorite'}
    </button>
  </div>
);

export default PodcastCard;