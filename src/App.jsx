import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from './Navbar';
import {Link} from 'react-router-dom'
import Sort from './components/Sort'


const Main = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {

    fetch('https://podcast-api.netlify.app/shows')
      .then((res) => res.json())
      .then((data) => {

        setPodcasts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    let sortedShows = [...ShowPreviews];
    switch (criteria) {
      case 'titleAZ':
        sortedShows.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        sortedShows.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'dateUpdatedAscending':
        sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'dateUpdatedDescending':
        sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navbar />
      <Sort />

      {selectedPodcast && (
        <div className="selected-podcast-details">
          <img src={selectedPodcast.image} alt={selectedPodcast.title} />
          <h2>Title:{selectedPodcast.title}</h2>
          <p>Id:{selectedPodcast.id}</p>
          <p>Updated:{selectedPodcast.updated}</p>
          <p>Season :{selectedPodcast.seasons}</p>
          <p>Description:{selectedPodcast.description}</p>

          <button onClick={clearSelectedPodcast}>Close</button>
        </div>
      )}

{loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <div className="podcast-container">

          <div className="season-selector">
            {/* Dropdown or buttons to select the season */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              >
              <option value={null}>All Seasons</option>
              {/* Assuming seasons are numbered from 1 to N */}
              {Array.from({ length: 70 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  Season {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="podcast-list">

            {selectedSeason === null
              ? podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="podcast-card"
                  onClick={() => handlePodcastCardClick(podcast)}
                >
                  {
                  
                  podcast.image && (
                    <img src={podcast.image} alt={podcast.title} />
                  )}
                  <h2>{podcast.title}</h2>
                  {/* Render the audio player for each episode */}
                  <audio controls>
                    <source src={podcast.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>