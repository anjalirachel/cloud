import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './PatientRegistration.css';
import axios from 'axios'; // For making HTTP requests

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    address: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    issue: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation (you can enhance this as needed)
    const validationErrors = {};
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.phoneNumber) validationErrors.phoneNumber = 'Phone Number is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // Wrap formData in the expected format
      const payload = {
        // operation: "create",
        body: JSON.stringify(formData),
      };

  
      // Make the API request
      const response = await axios.post('https://iz72w6q8ph.execute-api.us-east-1.amazonaws.com/dev/patients', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        // If successful, navigate to profile or success page
        navigate('/confirmation');
      } else {
        // Handle unexpected responses
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Error submitting form. Please try again.' });
    }
  };
  
  return (
    <Container className='form-container'>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className='heading'>Patient Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className='label-registration'>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter patient's name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="input-registration"
              />
              {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className='label-registration'>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter patient's email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="input-registration"
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formPhoneNumber">
              <Form.Label className='label-registration'>Phone Number</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter patient's phone number" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required 
                className="input-registration"
              />
              {errors.phoneNumber && <Form.Text className="text-danger">{errors.phoneNumber}</Form.Text>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formAge">
              <Form.Label className='label-registration'>Age</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter patient's age" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label className='label-registration'>Address</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter patient's address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formAllergies">
              <Form.Label className='label-registration'>Allergies</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter patient's allergies" 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formEmergencyContactName">
              <Form.Label className='label-registration'>Emergency Contact Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter emergency contact's name" 
                name="emergencyContactName" 
                value={formData.emergencyContactName} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formEmergencyContactPhone">
              <Form.Label className='label-registration'>Emergency Contact Phone</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter emergency contact's phone number" 
                name="emergencyContactPhone" 
                value={formData.emergencyContactPhone} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
    
            <Form.Group className="mb-3" controlId="formIssue">
              <Form.Label className='label-registration'>Issue</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter the issue" 
                name="issue" 
                value={formData.issue} 
                onChange={handleChange} 
                className="input-registration"
              />
            </Form.Group>
    
            {errors.general && <Form.Text className="text-danger">{errors.general}</Form.Text>}
    
            <Button variant="primary" type="submit" className="button-registration">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
