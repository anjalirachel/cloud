import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientRegistration from './components/PatientRegistration/PatientRegistration';
import PatientUpdate from './components/PatientUpdate/PatientUpdate';
import Confirmation from './components/Confirmation/Confirmation';
import MainPage from './components/MainPage/MainPage';
import DeletePatient from './components/DeletePatient/DeletePatient';
import GetPatient from './components/GetPatient/GetPatient';
import GetAllPatients from './components/GetAllPatients/GetAllPatients';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<PatientRegistration />} />
        <Route path="/update" element={<PatientUpdate />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/delete" element={<DeletePatient />} />
        <Route path="/get-patient" element={<GetPatient />} />
        <Route path="/get-all-patients" element={<GetAllPatients />} />
      </Routes>
    </Router>
  );
};

export default App;
