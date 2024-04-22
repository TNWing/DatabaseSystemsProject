import React from 'react';

function PetAdoption({ petNames, petImages }) {
  return (
    <div className="section">
      <h2>Pets to Adopt!</h2>
      <div className="pet-container">
        {petNames.map((petName, index) => (
          <div className="pet-card" key={index}>
            {/* Use the corresponding index to get the image URL */}
            <img src={petImages[index]} alt={petName} />
            <h3>{petName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetAdoption;
