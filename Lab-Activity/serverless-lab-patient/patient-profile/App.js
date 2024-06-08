// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
