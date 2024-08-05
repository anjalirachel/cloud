import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import './Confirmation.css';

const Confirmation = () => {
  return (
    <Container className='confirmation-container'>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className='heading'>Registration Successful</h2>
          <Alert variant='success'>
            Your registration has been completed successfully. Thank you!
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Confirmation;
