// Import React and other necessary modules
import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Define the UserDashboard component
function UserDashboard() {
  // Define states for various data
  const [volunteerFormVisible, setVolunteerFormVisible] = useState(false);
  const [donateFormVisible, setDonateFormVisible] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [petNames, setPetNames] = useState([]);
  const [petApplication, setPetApplication] = useState(null);
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDonations, setUserDonations] = useState([]);

  // Define function to handle donation submission
  const handleDonationSubmit = async (event) => {
    event.preventDefault();

    // Extract data from the form
    const organization = event.target.organization.value;
    const amount = event.target.amount.value;

    try {
      // Send donation data to the server
      const response = await fetch("http://localhost:5273/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organization, amount }),
      });

      // Check if the donation was successfully submitted
      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log("Donation submitted successfully");
        // Fetch pet application and donations again to update the data
        fetchPetApplication();
        fetchUserDonations(); // Update user donations after submission
      } else {
        // Handle errors, e.g., show an error message
        console.error("Error submitting donation:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  // Function to fetch organizations from the server
  const fetchOrganizations = async () => {
    try {
      const PORT = 5273;
      const response = await fetch(
        `http://${window.location.hostname}:${PORT}/organizations`
      );
      const data = await response.json();
      setOrganizations(data.organizations);
      resolve();
    } catch (error) {
      console.error("Error fetching organizations", error);
      reject(error);
    }
  };

  // Function to fetch pets from the server
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5273/userDashboard/pets");
      const data = await response.json();
      setPetNames(data.petNames);
      console.log(data.petNames);
    } catch (error) {
      console.error("Error fetching pets", error);
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

  // Function to open the volunteer form
  const openVolunteerForm = () => {
    setVolunteerFormVisible(true);
  };

  // Function to close the volunteer form
  const closeVolunteerForm = () => {
    setVolunteerFormVisible(false);
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
      {/* Volunteer and Donate buttons */}
      <div className="section">
        <button className="button" onClick={openVolunteerForm}>
          Volunteer
        </button>
        <button className="button" onClick={openDonateForm}>
          Donate
        </button>
      </div>
      {/* Volunteer Form */}
      <div
        className={`form-popup ${volunteerFormVisible ? "open" : ""}`}
        id="volunteerForm"
      >
        <form action="/action_page.php" className="form-container">
          <h2>Volunteer</h2>
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
          <br />
          <br />
          <label htmlFor="task">
            <b>Task:</b>
          </label>
          <select name="task" id="task">
            <option value="Task1">Walk Dogs</option>
            <option value="Task2">Feed Animals</option>
            <option value="Task3">Clean Shelter</option>
            <option value="Task4">Answer Phone Calls</option>
          </select>
          <br />
          <br />
          <button type="submit" className="button">
            Submit
          </button>
          <button
            type="button"
            className="button cancel"
            onClick={closeVolunteerForm}
          >
            Close
          </button>
        </form>
      </div>
      {/* Donate Form */}
      <div
        className={`form-popup ${donateFormVisible ? "open" : ""}`}
        id="donateForm"
      >
        <form action="/action_page.php" className="form-container">
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
          <br />
          <br />
          <label htmlFor="amount">
            <b>Amount:</b>
          </label>
          <input type="text" id="amount" name="amount" placeholder="$0.00" />
          <br />
          <br />
          <button
            type="submit"
            className="button"
            onClick={handleDonationSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="button cancel"
            onClick={closeDonateForm}
          >
            Close
          </button>
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
      {/* Pet Section */}
      <div className="section">
        <h2>Pets to Adopt!</h2>
        <div className="pet-container">
          {petNames.map((petName, index) => (
            <div className="pet-card" key={index}>
              {/* <img src={`https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg`} alt={petName} /> */}
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
