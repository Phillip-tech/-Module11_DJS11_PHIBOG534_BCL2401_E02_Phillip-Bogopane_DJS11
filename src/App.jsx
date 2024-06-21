import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import "./App.css";
import Navbar from './Navbar';
import Sort from './components/Sort';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';

const Main = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [listenedEpisodes, setListenedEpisodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const audioRef = useRef(null);
  

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
      .then((res) => res.json())
      .then((data) => {
        const processedData = data.map(podcast => ({
          ...podcast,
          genres: podcast.genres.map(genre => typeof genre === 'string' ? genre : genre.toString()),
          seasons: Array.isArray(podcast.seasons) ? podcast.seasons : [podcast.seasons]
        }));
        setPodcasts(processedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (audioRef.current && !audioRef.current.paused) {
        event.preventDefault();
        event.returnValue = 'Audio is playing. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const storedListenedEpisodes = JSON.parse(localStorage.getItem('listenedEpisodes')) || [];
    setListenedEpisodes(storedListenedEpisodes);

    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    let sortedShows = [...podcasts];
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
    setPodcasts(sortedShows);
  };

  const getEpisodesForSeason = (season) => {
    return podcasts.filter(podcast => podcast.seasons.includes(season));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePodcastClick = (podcast) => {
    setSelectedPodcast(podcast);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAudioEnded = (podcastId) => {
    const updatedListenedEpisodes = [...listenedEpisodes, podcastId];
    setListenedEpisodes(updatedListenedEpisodes);
    localStorage.setItem('listenedEpisodes', JSON.stringify(updatedListenedEpisodes));
  };

  const toggleFavorite = (podcastId) => {
    let updatedFavorites;
    if (favorites.includes(podcastId)) {
      updatedFavorites = favorites.filter(id => id !== podcastId);
    } else {
      updatedFavorites = [...favorites, podcastId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const fuse = new Fuse(podcasts, {
    keys: ['title', 'description', 'genres']
  });

  const filteredPodcasts = searchQuery ? fuse.search(searchQuery).map(result => result.item) : podcasts;

  const [carouselData, setCarouselData] = useState([]);
  const renderSeasonsCarousel = () => {
    if (!carouselData.length) return null;

    useEffect(() => {
      fetch('https://podcast-api.netlify.app/carousel')
        .then((res) => res.json())
        .then((data) => {
          setCarouselData(data);
        })
        .catch((error) => {
          console.error('Error fetching carousel data:', error);
        });
    }, []);
  
    return (
      <Carousel showThumbs={false} showStatus={false} infiniteLoop>
        {carouselData.map(podcast => (
          <div key={podcast.id} className="season-icon" onClick={() => handlePodcastClick(podcast)}>
            <img src={podcast.image} alt={podcast.title} />
            <p className="legend">{podcast.title}</p>
          </div>
        ))}
      </Carousel>
    );
  };
  return (
    <>
      <Navbar />
      <Sort searchQuery={searchQuery} handleSearchChange={handleSearchChange} sortBy={sortBy} handleSortChange={handleSortChange} />

      {selectedPodcast && (
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
      )}

      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <div className="podcast-container">
          <div className="season-selector">
            <select
              value={selectedSeason !== null ? selectedSeason : ""}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
            >
              <option value="">All Seasons</option>
              {Array.from({ length: 70 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  Season {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="podcast-list">
            {selectedSeason === null
              ? filteredPodcasts.map((podcast) => (
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
                    <audio controls onEnded={() => handleAudioEnded(podcast.id)}>
                      <source src={podcast.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <button onClick={() => toggleFavorite(podcast.id)}>
                      {favorites.includes(podcast.id) ? 'Unfavorite' : 'Favorite'}
                    </button>
                  </div>
                ))
              : getEpisodesForSeason(selectedSeason)
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((podcast) => (
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
                  ))}
          </div>
        </div>
      )}  
    </>
  );
};

export default Main;
