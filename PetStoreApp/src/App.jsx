import React, { useState, useEffect } from 'react';
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PetAdoption from './PetAdoption'; // Import PetAdoption component

function App() {
  // Define states for pet names and images
  const [petNames, setPetNames] = useState([]);
  const [petImages, setPetImages] = useState([]);

  const fetchPets = async () => {
    try {
      const response = await fetch('http://localhost:5273/pets');
      const data = await response.json();
      console.log('Fetched pets data:', data); // Add this line to log the fetched data

      if (data && data.petsData && Array.isArray(data.petsData)) {
        const petNamesArray = data.petsData.map(pet => pet.pname); 
        const petImagesArray = data.petsData.map(pet => pet.imageurl); 
        setPetNames(petNamesArray);
        setPetImages(petImagesArray);
      } else {
        console.error('Invalid pets data format');
      }
    } catch (error) {
      console.error('Error fetching pets', error);
    }
  };

  useEffect(() => {
    fetchPets(); // Fetch pet data when component mounts
  }, []);

  return (
    <div>
      <header data-bs-theme="dark">
        <Navbar/>
      </header>
      <main>
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 1"/>
              <div className="container">
                <div className="carousel-caption text-start transparent-bg">
                  <h1>Bringing joy.</h1>
                  <p className="opacity-75">Join us in our mission to bring joy into the lives of pets and people alike, one adoption at a time.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Adopt</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 2"/>
              <div className="container">
                <div className="carousel-caption transparent-bg">
                  <h1>Finding family.</h1>
                  <p>Together, we make tails wag as we unite pets with their forever families, spreading happiness and love.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Donate</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 3"/>
              <div className="container">
                <div className="carousel-caption text-end transparent-bg">
                  <h1>Transforming lives.</h1>
                  <p>From shelter to forever family, we're dedicated to guiding pets on their journey to finding lasting love and companionship.</p>
                  <p><a className="btn btn-lg btn-primary" href="/resources">Resources</a></p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Display PetAdoption component */}
        <PetAdoption petNames={petNames} petImages={petImages} />

        <Footer/>
      </main>
    </div>
  );
}

export default App;
