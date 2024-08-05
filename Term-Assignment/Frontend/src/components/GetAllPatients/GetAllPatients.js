import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { json } from 'react-router-dom';

const GetAllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    try {
      const response = await axios.get('https://iz72w6q8ph.execute-api.us-east-1.amazonaws.com/dev/patients');
      console.log('Fetched data:', response.data);
      const body=JSON.parse(response.data.body);
      console.log(body);
      
      // Check if the response data is an array
      if (Array.isArray(body)) {
        setPatients(body);
        setError('');
      } else {
        setError('Unexpected data format.');
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error fetching patients.');
      setPatients([]);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2 className="heading">Get All Patients</h2>
          <Button variant="primary" onClick={handleFetch}>
            Fetch All Patients
          </Button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {patients.length > 0 ? (
            <div className="table-container mt-3">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Allergies</th>
                    <th>Emergency Contact Name</th>
                    <th>Emergency Contact Phone</th>
                    <th>Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.patientId}>
                      <td>{patient.name || 'N/A'}</td>
                      <td>{patient.email || 'N/A'}</td>
                      <td>{patient.phoneNumber || 'N/A'}</td>
                      <td>{patient.age || 'N/A'}</td>
                      <td>{patient.address || 'N/A'}</td>
                      <td>{patient.allergies || 'N/A'}</td>
                      <td>{patient.emergencyContactName || 'N/A'}</td>
                      <td>{patient.emergencyContactPhone || 'N/A'}</td>
                      <td>{patient.issue || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="alert alert-info mt-3">No patients found.</div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default GetAllPatients;
