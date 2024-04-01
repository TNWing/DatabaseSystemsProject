import React from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
import { NavDropdown } from "react-bootstrap";

function Navbar() {
    return(
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">PetRescueNetwork</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <a className="nav-link active custom-link" aria-current="page" href="#">ADOPT</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active custom-link" aria-current="page" href="#">DONATE</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active custom-link" aria-current="page" href="#">VOLUNTEER</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active custom-link" aria-current="page" href="#">RESOURCES</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active custom-link" aria-current="page" href="/users/login">SIGN IN</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    )
}


export default Navbar;