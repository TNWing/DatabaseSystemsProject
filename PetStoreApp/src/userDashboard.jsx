// Import React and other necessary modules
import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Define the UserDashboard component
function UserDashboard() {
  // Define states for various data
  const [donateFormVisible, setDonateFormVisible] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [petNames, setPetNames] = useState([]);
  const [petApplication, setPetApplication] = useState(null);
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [petImages, setPetImages] = useState([]);


  const handleDonationSubmit = async (event) => {
    event.preventDefault();
  
    const form = event.target.closest('form');
    const organizationName = form.querySelector('#organization').value; // Get the organization name from the dropdown
    const amount = form.querySelector('#amount').value; // Get the amount as a string
  
    try {
      // Fetch org_id using the organization name from the backend endpoint
      const orgIdResponse = await fetch(`http://localhost:5273/organizations/${organizationName}`);
      if (!orgIdResponse.ok) {
        throw new Error(`Organization '${organizationName}' not found`);
      }
  
      const orgIdData = await orgIdResponse.json();
      const orgId = orgIdData.org_id;
  
      // Submit the donation with the retrieved org_id
      const donationResponse = await fetch('http://localhost:5273/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: 'user001',
          org_id: orgId,
          amount: amount, // Ensure amount is sent as a string
        }),
      });
      console.log('Request Body:', { userid: 'user001', org_id: orgId, amount: amount });
      if (donationResponse.ok) {
        console.log('Donation submitted successfully');
        fetchUserDonations();
        closeDonateForm();
      } else {
        console.error('Error submitting donation:', donationResponse.statusText);
      }
    } catch (error) {
      console.error('Error submitting donation:', error.message);
    }
  };
  
  
  // Define function to fetch data from the server
  // const fetchData = async() => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       await fetchPets();
  //       await fetchOrganizations();
  //       await fetchPetApplication();
  //       await fetchUserDetails();
  //       await fetchUserDonations();
  //       resolve(); 
  //     } catch (error) {
  //       reject(error); 
  //     }
  //   });
  // };

  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData()
      .then(() => {
        console.log('Data fetching completed successfully');
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:5273/organizations');
      const data = await response.json();
      setOrganizations(data.organizations);
    } catch (error) {
      console.error('Error fetching organizations', error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch('http://localhost:5273/pets');
      const data = await response.json();
      console.log('Fetched pets data:', data); // Add this line to log the fetched data
  
      if (data && data.petsData && Array.isArray(data.petsData)) {
        const petNamesArray = data.petsData.map(pet => pet.pname); // Assuming 'pname' is the property for pet name
        const petImagesArray = data.petsData.map(pet => pet.imageurl); // Assuming 'imageURL' is the property for image URL
        setPetNames(petNamesArray);
        setPetImages(petImagesArray);
      } else {
        console.error('Invalid pets data format');
      }
    } catch (error) {
      console.error('Error fetching pets', error);
    }
  };
  
  
  
  // Function to fetch pet application from the server
  const fetchPetApplication = async (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`http://localhost:5273/adopt/${username}`);
        const data = await response.json();
        setPetApplication(data);
        resolve();
      } catch (error) {
        console.error("Error fetching pet application", error);
        reject(error);
      }
    });
  };

  // Function to fetch user details from the server
  const fetchUserDetails = async (username) => {
    try {
      const response = await fetch(`http://localhost:5273/users/${username}`);
      const data = await response.json();
      const fullName = `${data.fname} ${data.lname}`;
      console.log(fullName)
      setUserName(fullName);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  // Function to fetch user donations from the server
  const fetchUserDonations = async (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `http://localhost:5273/donations/${username}`
        );
        const data = await response.json();
        setUserDonations(data.donations);
        resolve();
      } catch (error) {
        console.error("Error fetching user donations", error);
        reject(error);
      }
    });
  };

  // Function to open the donate form
  const openDonateForm = () => {
    setDonateFormVisible(true);
  };

  // Function to close the donate form
  const closeDonateForm = () => {
    setDonateFormVisible(false);
  };
  // const [fname, setFname] = useState(""); // State to store the first name

  useEffect(() => {
    fetch('/checkLoggedIn')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Get response body as text
      })
      .then(data => {
        if (data.startsWith('{')) {
          // Check if the response data starts with '{', indicating it's likely JSON
          try {
            const jsonData = JSON.parse(data); // Parse JSON from text
            if (jsonData.loggedIn) {
              setLoggedIn(true);
              setUserName(jsonData.username); // Set username if logged in
            } else {
              setLoggedIn(false);
              setUserName(""); // Clear username if not logged in
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle JSON parsing error
          }
        } else {
          console.error('Response is not JSON:', data);
          // Handle case where response is not JSON
        }
      })
      .catch(error => {
        console.error('Error checking if user is logged in:', error.message);
        // Handle other errors
      });
  }, []);



  useEffect(() => {
    if (loggedIn) {
      // Fetch data for the logged-in user
      fetchData(userName)
        .then(() => {
          console.log("Data fetching completed successfully");
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [loggedIn, userName]);

  // Define function to fetch data from the server for the specific user
  const fetchData = async (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        await fetchOrganizations();
        await fetchPets();
        await fetchPetApplication(username);
        await fetchUserDetails(username);
        await fetchUserDonations(username);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Render the UI
  return (
    <div className="container">
      {/* Navbar */}
      <header data-bs-theme="dark">
        <Navbar />
      </header>
      {/* Header */}
      <div className="header">
        <h1>Hello, {userName}</h1>
      </div>

      {/*Donate buttons */}
      <div className="section">
        <button className="button" onClick={openDonateForm}>Donate</button>
      </div>

      {/* Donate Form */}
      <div className={`form-popup ${donateFormVisible ? 'open' : ''}`} id="donateForm">
      <form onSubmit={handleDonationSubmit} className="form-container">
          <h2>Donate</h2>
          <label htmlFor="organization">
            <b>Organization:</b>
          </label>
          <select name="organization" id="organization">
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
          <br /><br />
          <label htmlFor="amount"><b>Amount:</b></label>
          <input type="text" id="amount" name="amount" placeholder="$0.00" /><br /><br />
          <button type="submit" className="button">Submit</button>
          <button type="button" className="button cancel" onClick={closeDonateForm}>Close</button>
        </form>
      </div>
      {/* Display Pet Application and User Donations */}
      <div className="section">
        <h3>Pet Applications</h3>
        {petApplication ? (
          <div>
            <p>User Name: {userName}</p>
            <p>Pet Name: {petApplication.pname}</p>
          </div>
        ) : (
          <p>No pet application found for {userName}</p>
        )}

        <h3>Donations</h3>
        {userDonations.map((donation, index) => (
          <div key={index}>
            <p>Organization: {donation.organization}</p>
            <p>Amount: ${donation.amount}</p>
          </div>
        ))}
      </div>
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
      {/* Pagination */}
      <div className="pagination">
        <a href="#" className="w3-bar-item w3-button w3-hover-black">
          «
        </a>
        <a href="#" className="w3-bar-item w3-black w3-button">
          1
        </a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">
          2
        </a>
        {/* <a href="#" className="w3-bar-item w3-button w3-hover-black">3</a>
        <a href="#" className="w3-bar-item w3-button w3-hover-black">4</a> */}
        <a href="#" className="w3-bar-item w3-button w3-hover-black">
          »
        </a>
      </div>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

// Export the UserDashboard component
export default UserDashboard;
