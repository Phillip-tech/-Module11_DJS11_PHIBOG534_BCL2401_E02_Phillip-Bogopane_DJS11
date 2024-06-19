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