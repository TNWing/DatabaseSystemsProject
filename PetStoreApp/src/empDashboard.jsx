import React, { useState } from "react";
import Footer from './components/Footer'; // Import the Footer component
import "./styles.css";
import Navbar from './components/Navbar';

function EmpDashboard() {
  const [insertFormVisible, setInsertFormVisible] = useState(false);
  
  const openInsertForm = () => {
    setInsertFormVisible(true);
  };

  const closeInsertForm = () => {
    setInsertFormVisible(false);
  };

  const [resources, setResources] = useState([
    { id: 1, name: "Resource 1", category: "Category A" },
    { id: 2, name: "Resource 2", category: "Category B" },
    { id: 3, name: "Resource 3", category: "Category C" },
  ]);

  const handleUpdate = (id) => {
    // Handle update logic here
    console.log(`Update resource with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete logic here
    console.log(`Delete resource with ID: ${id}`);
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
              <th>ID</th>
              <th>URL</th>
              <th>Organization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.name}</td>
                <td>{resource.name}</td>
                <td>
                  <button className="btn-update" onClick={() => handleUpdate(resource.id)}>
                    Update
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(resource.id)}>
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
          <h4><b>Resource 1</b></h4>
          <h4><b>Resource 2</b></h4>
          <h4><b>Resource 3</b></h4>
        </div>
      </div>


      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default EmpDashboard;
