import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Resources from './Resources.jsx';
import Donate from './Donate.jsx';
import Home from './home.jsx';
import Login from './register.jsx';

function Main() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="Main">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<App email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route path="/register" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/home" element={<Home email={email} loggedIn={loggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Main;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
