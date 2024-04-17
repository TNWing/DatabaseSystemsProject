import React, { useState, useEffect } from "react";
import Footer from './components/Footer'; // Import the Footer component
import "./styles.css";
import Navbar from './components/Navbar';

function EmpDashboard() {
  const [insertFormVisible, setInsertFormVisible] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5273/resources`);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error.message);
    }
  };

  const openInsertForm = () => {
    setInsertFormVisible(true);
  };

  const closeInsertForm = () => {
    setInsertFormVisible(false);
  };

  const handleUpdate = async (id, currentUrl) => {
    try {
      const updatedUrl = prompt('Enter the updated URL:', currentUrl);
      if (!updatedUrl) {
        // If the user cancels or does not provide a new URL, return without updating
        return;
      }
      console.log(updatedUrl)
      console.log(JSON.stringify({ url: updatedUrl }))
      // Send a PUT request to update the resource URL
      const response = await fetch(`http://${window.location.hostname}:5273/empDashboard/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: updatedUrl })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update resource URL');
      }
  
      // If the update is successful, reload the page to reflect the changes
      // window.location.reload();
    } catch (error) {
      console.error('Error updating resource URL:', error.message);
      // Handle error - display an error message to the user or handle as needed
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to server to delete the resource
      const response = await fetch(`http://${window.location.hostname}:5273/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      // If deletion successful, update local state by removing the deleted resource
      setResources(resources.filter(resource => resource.id !== id));
      window.location.reload();
      console.log(`Resource with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting resource:', error.message);
      // Handle error - display an error message to the user
    }
  };

  return (
    <div className="container">

      <header data-bs-theme="dark">
        <Navbar/>
      </header>

      {/* Header */}
      <div className="header">
        <h1>Hello, Employee FName</h1>
      </div>

      {/* Insert buttons */}
      <div className="section">
        <button className="button" onClick={openInsertForm}>Insert</button>
      </div>

      {/* Insert Form */}
      <div className={`form-popup ${insertFormVisible ? 'open' : ''}`} id="insertForm">
        <form action="/action_page.php" className="form-container">
          <h2>Insert into resources:</h2>
          <label htmlFor="resource"><b>Resource URL:</b></label>
          <input type="text" id="resource" name="resource" placeholder="Resource URL" /><br /><br />
          <button type="submit" className="button">Submit</button>
          <button type="button" className="button cancel" onClick={closeInsertForm}>Close</button>
        </form>
      </div>

      {/* Resource Table */}
      <div className="section">
        <h2>Resources</h2>
        <table className="resource-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>URL</th>
              {/* Need to join prov-resources with organization to obtain this */}
              {/* <th>Organization</th> */} 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.resourcenum}>
                <td>{resource.resourcenum}</td>
                <td>{resource.resourceurl}</td> {/* Adjust this according to your resource object structure */}
                {/* <td>{resource.organization}</td> Adjust this according to your resource object structure */}
                <td>
                  <button className="btn-update" onClick={() => handleUpdate(resource.resourcenum)}>
                    Update
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(resource.resourcenum)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Other content */}
      <div className="section">
        <h3>Organization Name: Resources</h3>
        <div className="applications">
          {resources.map((resource) => (
            <h4 key={resource.resourcenum}><b>{resource.name}</b></h4>
          ))}
        </div>
      </div>

      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default EmpDashboard;
