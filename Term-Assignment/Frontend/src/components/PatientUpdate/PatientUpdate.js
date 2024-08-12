import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import "./PatientUpdate.css";

const PatientUpdate = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    address: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    issue: "",
    fieldsToUpdate: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFieldChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const fields = prev.fieldsToUpdate.includes(value)
        ? prev.fieldsToUpdate.filter((field) => field !== value)
        : [...prev.fieldsToUpdate, value];
      return { ...prev, fieldsToUpdate: fields };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.patientId)
      validationErrors.patientId = "Patient ID is required";
    formData.fieldsToUpdate.forEach((field) => {
      if (!formData[field]) validationErrors[field] = `${field} is required`;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updatePayload = formData.fieldsToUpdate.reduce(
        (acc, field) => {
          acc[field] = formData[field];
          return acc;
        },
        { patientId: formData.patientId }
      );
      console.log(updatePayload);

      // Send the payload directly, without wrapping it in 'body'
      const response = await axios.put(
        `https://n3rkuyywwe.execute-api.us-east-1.amazonaws.com/dev/patients/patient_id`,
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        // Display an alert and refresh the page
        alert("Patient record updated successfully.");
        window.location.reload();
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Error submitting form. Please try again." });
    }
  };

  return (
    <Container className="form-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className="heading">Patient Update</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formPatientId">
              <Form.Label className="label-update">Patient ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient ID"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="input-update"
              />
              {errors.patientId && (
                <Form.Text className="text-danger">
                  {errors.patientId}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFieldsToUpdate">
              <Form.Label className="label-update">
                Select Fields to Update
              </Form.Label>
              {[
                "name",
                "email",
                "phoneNumber",
                "age",
                "address",
                "allergies",
                "emergencyContactName",
                "emergencyContactPhone",
                "issue",
              ].map((field) => (
                <Form.Check
                  key={field}
                  type="checkbox"
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name="fieldsToUpdate"
                  value={field}
                  checked={formData.fieldsToUpdate.includes(field)}
                  onChange={handleFieldChange}
                />
              ))}
            </Form.Group>

            {formData.fieldsToUpdate.map((field) => (
              <Form.Group
                key={field}
                className="mb-3"
                controlId={`form${field}`}
              >
                <Form.Label className="label-update">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Enter patient's ${field}`}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="input-update"
                />
                {errors[field] && (
                  <Form.Text className="text-danger">{errors[field]}</Form.Text>
                )}
              </Form.Group>
            ))}

            {errors.general && (
              <Form.Text className="text-danger">{errors.general}</Form.Text>
            )}

            <Button variant="primary" type="submit" className="button-update">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientUpdate;
