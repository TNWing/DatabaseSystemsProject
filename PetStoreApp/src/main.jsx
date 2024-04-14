import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Resources from './Resources.jsx';
import UserDashboard from './userDashboard.jsx';
import EmpDashboard from './empDashboard.jsx';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/empDashboard" element={<EmpDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
