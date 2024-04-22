import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css"; // Import CSS for custom styling

function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(
        `http://${window.location.hostname}:5273/resources`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  return (
    <div className="resources-page">
      <Navbar title="Resources" /> {/* Move the title to Navbar */}
      <div className="resources-content">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>URL</th>
              {/* Need to join prov-resources with organization to obtain this */}
              {/* <th>Organization</th> */}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.resourcenum}>
                <td>{resource.resourcenum}</td>
                <td>{resource.resourceurl}</td> {/* Adjust this according to your resource object structure */}
                {/* <td>{resource.organization}</td> Adjust this according to your resource object structure */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default Resources;
