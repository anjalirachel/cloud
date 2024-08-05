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
            className="mb-3"
            onClick={() => handleNavigate('/update')}
          >
            Update Existing Patient
          </Button>
          <br />
          <Button 
            variant="info" 
            className="mb-3"
            onClick={() => handleNavigate('/delete')}
          >
            Delete Patient
          </Button>
          <br />
          <Button 
            variant="success" 
            className="mb-3"
            onClick={() => handleNavigate('/get-patient')}
          >
            Get Particular Patient
          </Button>
          <br />
          <Button 
            variant="warning" 
            onClick={() => handleNavigate('/get-all-patients')}
          >
            Get All Patients
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
