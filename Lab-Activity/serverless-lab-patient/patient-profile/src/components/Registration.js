import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation patterns
    const namePattern = /^[a-zA-Z]+$/;
    const emailPattern = /^\S+@\S+\.\S+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation messages
    const validationErrors = {};
    if (!formData.firstName.match(namePattern)) {
      validationErrors.firstName = 'First name should contain only alphabets';
    }
    if (!formData.lastName.match(namePattern)) {
      validationErrors.lastName = 'Last name should contain only alphabets';
    }
    if (!formData.email.match(emailPattern)) {
      validationErrors.email = 'Invalid email format';
    }
    if (!formData.password.match(passwordPattern)) {
      validationErrors.password = 'Password should contain at least 8 characters including one letter, one number, and one special character';
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // If no errors, navigate to profile page
      navigate('/profile');
    }
  };

  return (
        <Container className='form-container'>
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <h2 className='heading'>Registration</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label className='label-registration'>First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your first name" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required className="input-registration"
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label className='label-registration'>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your last name" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required className="input-registration"
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className='label-registration'>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required className="input-registration"
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className='label-registration'>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter your password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required className="input-registration" 
                    minLength={8} 
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label className='label-registration'>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm your password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required className="input-registration" 
                    minLength={8} 
                  />
                </Form.Group>
    
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
