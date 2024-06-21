import React from 'react';

const SeasonSelector = ({ selectedSeason, setSelectedSeason }) => (
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
);

export default SeasonSelector;