import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const DeletePatient = () => {
  const [patientId, setPatientId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPatientId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://iz72w6q8ph.execute-api.us-east-1.amazonaws.com/dev/patients/patient_id`, {
        data: { patientId }
      });
      if (response.status === 200) {
        setResponseMessage('Patient successfully deleted.');
        setPatientId('');
      } else {
        setError('Failed to delete patient.');
      }
    } catch (error) {
      setError('Error deleting patient.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className='heading'>Delete Patient</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formPatientId">
              <Form.Label>Patient ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient ID"
                value={patientId}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {responseMessage && <div className="alert alert-success">{responseMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <Button variant="danger" type="submit">
              Delete
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DeletePatient;
