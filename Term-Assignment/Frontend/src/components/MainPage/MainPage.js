import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container className='text-center'>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className='heading'>Patient Management</h2>
          <Button 
            variant="primary" 
            className="mb-3"
            onClick={() => handleNavigate('/register')}
          >
            Register New Patient
          </Button>
          <br />
          <Button 
            variant="secondary" 
            onClick={() => handleNavigate('/update')}
          >
            Update Existing Patient
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
