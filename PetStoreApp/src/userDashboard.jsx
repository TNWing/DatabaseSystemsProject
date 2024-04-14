import React, { useState } from "react";
import Footer from './components/Footer'; // Import the Footer component
import "./styles.css";
import Navbar from './components/Navbar';

function UserDashboard() {
  const [volunteerFormVisible, setVolunteerFormVisible] = useState(false);
  const [donateFormVisible, setDonateFormVisible] = useState(false);

  const openVolunteerForm = () => {
    setVolunteerFormVisible(true);
  };

  const closeVolunteerForm = () => {
    setVolunteerFormVisible(false);
  };

  const openDonateForm = () => {
    setDonateFormVisible(true);
  };

  const closeDonateForm = () => {
    setDonateFormVisible(false);
  };

  return (
    <div className="container">

      <header data-bs-theme="dark">
        <Navbar/>
      </header>

      {/* Header */}
      <div className="header">
        <h1>Hello, User FName</h1>
      </div>

      {/* Volunteer and Donate buttons */}
      <div className="section">
        <button className="button" onClick={openVolunteerForm}>Volunteer</button>
        <button className="button" onClick={openDonateForm}>Donate</button>
      </div>

      {/* Volunteer Form */}
      <div className={`form-popup ${volunteerFormVisible ? 'open' : ''}`} id="volunteerForm">
        <form action="/action_page.php" className="form-container">
          <h2>Volunteer</h2>
          <label htmlFor="organization"><b>Organization:</b></label>
          <select name="organization" id="organization">
            <option value="Org1">Org1</option>
            <option value="Org2">Org2</option>
            <option value="Org3">Org3</option>
            <option value="Org4">Org4</option>
          </select>
          <br /><br />
          <label htmlFor="task"><b>Task:</b></label>
          <select name="task" id="task">
            <option value="Task1">Walk Dogs</option>
            <option value="Task2">Feed Animals</option>
            <option value="Task3">Clean Shelter</option>
            <option value="Task4">Answer Phone Calls</option>
          </select>
          <br /><br />
          <button type="submit" className="button">Submit</button>
          <button type="button" className="button cancel" onClick={closeVolunteerForm}>Close</button>
        </form>
      </div>

      {/* Donate Form */}
      <div className={`form-popup ${donateFormVisible ? 'open' : ''}`} id="donateForm">
        <form action="/action_page.php" className="form-container">
          <h2>Donate</h2>
          <label htmlFor="organization"><b>Organization:</b></label>
          <select name="organization" id="organization">
            <option value="Org1">Org1</option>
            <option value="Org2">Org2</option>
            <option value="Org3">Org3</option>
            <option value="Org4">Org4</option>
          </select>
          <br /><br />
          <label htmlFor="amount"><b>Amount:</b></label>
          <input type="text" id="amount" name="amount" placeholder="$0.00" /><br /><br />
          <button type="submit" className="button">Submit</button>
          <button type="button" className="button cancel" onClick={closeDonateForm}>Close</button>
        </form>
      </div>

      {/* Other content */}
      <div className="section">
        <h3>My Applications</h3>
        <div className="applications">
          <h4><b>App ID 1, PName</b></h4>
          <h4><b>App ID 2, PName</b></h4>
          <h4><b>App ID 3, PName</b></h4>
        </div>
      </div>

      {/* Pet Section */}
      <div className="section">
        <h2>Pets to Adopt!</h2>
        <div className="pet-container">
          <div className="pet-card">
            <img src="PetStoreApp\src\images\petImage1.jpg" alt="Pet1" />
            <h3>Pet 1</h3>
          </div>
          <div className="pet-card">
            <img src="PetStoreApp\src\images\petImage1.jpg" alt="Pet2" />
            <h3>Pet 2</h3>
          </div>
          <div className="pet-card">
            <img src="PetStoreApp\src\images\petImage1.jpg" alt="Pet3" />
            <h3>Pet 3</h3>
          </div>
          {/* Add more pet cards here */}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <a href="#" className="w3-bar-item w3-button w3-hover-black">«</a>
        <a href="#" className="w3-bar-item w3-black w3-button">1</a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">2</a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">3</a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">4</a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">»</a>
      </div>

      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default UserDashboard;
