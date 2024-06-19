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