import React from 'react';

const PodcastDetails = ({ selectedPodcast, formatDate, handleAudioEnded, toggleFavorite, favorites, audioRef, renderSeasonsCarousel }) => (
  <div className="selected-podcast-details">
    <img src={selectedPodcast.image} alt={selectedPodcast.title} />
    <h2>Title: {selectedPodcast.title}</h2>
    <p>Id: {selectedPodcast.id}</p>
    <p>Updated: {formatDate(selectedPodcast.updated)}</p>
    <p>Season: {selectedPodcast.seasons.join(', ')}</p>
    <p>Description: {selectedPodcast.description}</p>
    <p>Genres: {selectedPodcast.genres.join(', ')}</p>
    <button onClick={() => setSelectedPodcast(null)}>Close</button>
    <audio ref={audioRef} controls onEnded={() => handleAudioEnded(selectedPodcast.id)}>
      <source src={selectedPodcast.audio} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <button onClick={() => toggleFavorite(selectedPodcast.id)}>
      {favorites.includes(selectedPodcast.id) ? 'Unfavorite' : 'Favorite'}
    </button>
    {renderSeasonsCarousel()}
  </div>
);

export default PodcastDetails;