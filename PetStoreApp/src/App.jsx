import React from 'react';
import './App.css'
import {Button, Navbar, Container, Nav, NavDropdown} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <div>
      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">PetRescueNetwork</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">ADOPT</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">DONATE</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">VOLUNTEER</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">RESOURCES</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active">SIGN IN</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
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
                <img src="src/images/petImage1.jpg" className="d-block w-100" alt="Slide 1"/>
                <div className="container">
                    <div className="carousel-caption text-start">
                        <h1>Example headline.</h1>
                        <p className="opacity-75">Some representative placeholder content for the first slide of the carousel.</p>
                        <p><a className="btn btn-lg btn-primary" href="#">Sign up today</a></p>
                    </div>
                </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage2.jpeg" className="d-block w-100" alt="Slide 2"/>
              <div className="container">
                <div className="carousel-caption">
                  <h1>Another example headline.</h1>
                  <p>Some representative placeholder content for the second slide of the carousel.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Learn more</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 3"/>
              <div className="container">
                <div className="carousel-caption text-end">
                  <h1>One more for good measure.</h1>
                  <p>Some representative placeholder content for the third slide of this carousel.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Browse gallery</a></p>
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
      </main>
    </div>
  );
}

export default App;

{/* <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form> */}
