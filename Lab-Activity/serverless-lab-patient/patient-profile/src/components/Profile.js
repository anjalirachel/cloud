import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import './Profile.css';
import '../App.css';

const Profile = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pgbdlhxg5zyg2gp6kifvfcx6va0myhde.lambda-url.us-east-1.on.aws/');
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error('Failed to fetch patient data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (patientId) => {
    try {
      const response = await fetch('https://bswratc6chpqigvrmddgl4hbdu0jdbra.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
      });

      if (response.ok) {
        // Refresh patient data after successful deletion
        const updatedPatients = patients.filter(patient => patient.patientId !== patientId);
        setPatients(updatedPatients);
      } else {
        console.error('Failed to delete patient data:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting patient data:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        {patients.map((patient, index) => (
          <Col key={index} xs={12} md={6}>
            <Card className="card-profile">
              <Card.Body className="card-body">
                <Card.Title className="card-title-profile">Profile</Card.Title>
                <Card.Text className="card-text-profile">
                  <strong className='text-area'>Name:</strong> {patient.name}<br />
                  <strong className='text-area'>Patient ID:</strong> {patient.patientId}<br />
                  <strong className='text-area'>Allergies:</strong> {patient.allergies.join(', ')}<br />
                  <strong className='text-area'>Doctor Name:</strong> {patient.doctor_name}<br />
                </Card.Text>
                <Button variant="danger" onClick={() => handleDelete(patient.patientId)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Profile;
