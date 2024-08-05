import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientRegistration from './components/PatientRegistration/PatientRegistration';
import PatientUpdate from './components/PatientUpdate/PatientUpdate';
import Confirmation from './components/Confirmation/Confirmation';
import MainPage from './components/MainPage/MainPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<PatientRegistration />} />
        <Route path="/update" element={<PatientUpdate />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
};

export default App;
