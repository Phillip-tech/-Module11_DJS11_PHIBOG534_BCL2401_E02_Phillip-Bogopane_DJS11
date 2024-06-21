import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

const CarouselComponent = ({ handlePodcastClick }) => {
  const [carouselData, setCarouselData] = useState([]);

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

  if (!carouselData.length) return null;

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

export default CarouselComponent;