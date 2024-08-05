import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

const GetPatient = () => {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPatientId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://iz72w6q8ph.execute-api.us-east-1.amazonaws.com/dev/patients/patient_id',
        { patientId: patientId }, // Pass object directly
        {
          headers: {
            'Content-Type': 'application/json' // Ensure content type is application/json
          }
        }
      );
      
      if (response.status === 200) {
        setPatientData(response.data);
        setError("");
      } else {
        setError("Patient not found.");
        setPatientData(null);
      }
    } catch (error) {
      setError("Error fetching patient data.");
      setPatientData(null);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="heading">Get Particular Patient</h2>
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
            {error && <div className="alert alert-danger">{error}</div>}
            {patientData && (
              <div className="alert alert-info">
                <pre>{JSON.stringify(patientData, null, 2)}</pre>
              </div>
            )}
            <Button variant="primary" type="submit">
              Get Patient
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default GetPatient;
