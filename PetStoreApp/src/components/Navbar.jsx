import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate username
    if (!username.trim()) {
      setUsernameError("Please enter your username");
    } else {
      setUsernameError("");
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Please enter your password");
    } else {
      setPasswordError("");
    }

    // If both username and password are filled, proceed with form submission
    if (username.trim() && password.trim()) {
      // Perform further actions, sa submitting form data
      console.log("Form submitted with username:", username, "and password:", password);
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PetRescueNetwork
        </Link>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
                  <Link className="nav-link active custom-link" aria-current="page" to="/empDashboard">empDashboard</Link>
            </li>
            <li className="nav-item">
                  <Link className="nav-link active custom-link" aria-current="page" to="/userDashboard">userDashboard</Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active custom-link"
                aria-current="page"
                to="/resources"
              >
                RESOURCES
              </Link>
            </li>
            <li className="nav-item" >
              <a className="nav-link active custom-link"
                aria-current="page" onClick={toggleLoginForm}  href="#">SIGN IN</a>
            </li>
          </ul>
        </div>
      </div>
      {showLoginForm && (
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <div className="error-message">{usernameError}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <button type="submit">Sign In</button>
            <div>
              <span style={{ color: 'white' }}>Not a member? </span>
              <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
