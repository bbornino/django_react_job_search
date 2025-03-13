import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Card, CardTitle, CardBody, CardFooter, Row, Col, FormGroup, Label, Input } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ENFORCE_STRONG_PASSWORD = process.env.REACT_APP_ENFORCE_STRONG_PASSWORD === "true";

export default function Register() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [backendErrors, setBackendErrors] = useState([]);
    const navigate = useNavigate();

    const handlePasswordToggle = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validateUserName = (username) => {
        const usernameRegex = /^(?=.{3,20}$)(?![_\-.])(?!.*[_\-.]{2})[a-zA-Z0-9._-]+(?<![_\-.])$/;

        if (!usernameRegex.test(username)) {
            setUsernameError(
                "Username must be 3–20 characters long, alphanumeric, and can include underscores (_), dots (.), or hyphens (-). It cannot start, end, or have consecutive special characters."
            );
            return false;
        }

        setUsernameError(""); // Clear error if validation passes
        return true;
    }

    const validatePassword = (password) => {
        if (!ENFORCE_STRONG_PASSWORD) {
            return true; // No validation if the feature is disabled
        }

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;


        if (!strongPasswordRegex.test(password)) {
            setPasswordError(
                "Password must be at least 12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return false;
        }

        setPasswordError(""); // Clear error if validation passes
        return true;
    };

    const validateEmail = (email) => {
        const sanitizedEmail = email.trim(); // Trim whitespace
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;

        if (!emailRegex.test(sanitizedEmail)) {
            setEmailError(
                "Please enter a valid email address."
            );
            console.log("Email Address Tested: " + email)
            return false;
        }

        setEmailError(""); // Clear error if validation passes
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run all validations before proceeding
        const isUsernameValid = validateUserName(username);
        const isPasswordValid = validatePassword(password);
        const isEmailValid = validateEmail(email);

        // If any validation fails, stop form submission
        if (!isUsernameValid || !isPasswordValid || !isEmailValid) {
            console.error("Validation failed. Please fix the errors and try again.");
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}auth/register/`, {
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                email,
            });

            if (response.status === 201) { // Assuming 201 Created for successful registration
                console.log("Registration successful:", response.data);
                navigate("/login"); // Redirect to login page after successful registration
            } else {
                console.error("Unexpected response during registration:", response);
            }
        } catch (err) {
            console.error("Error during registration:", err);
            console.error(err.response?.data?.error)
            setBackendErrors(
                Array.isArray(err.response?.data?.error)
                  ? err.response.data.error
                  : typeof err.response?.data?.error === 'string'
                  ? err.response?.data?.error.startsWith('[')  // Check if the string looks like an array
                    ? JSON.parse(err.response?.data?.error.replace(/'/g, '"'))  // Parse the string as JSON if it's an array-like string
                    : [err.response?.data?.error]  // Otherwise, wrap the single error in an array
                  : ['An unknown error occurred']
              );
              
        }
    }

    return (
        <Container className="centered-container">
            <Form onSubmit={handleSubmit}>
                <Card className="text-dark bg-light m-3 card-medium">
                    <CardTitle><strong>Register</strong></CardTitle>
                    <CardBody className="bg-white">
                        <Row id="full_name" >
                            <Col id="first_name" >
                                <FormGroup>
                                    <Label>First Name</Label>
                                    <Input
                                    type="text" required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col id="last_name" >
                                <FormGroup>
                                    <Label>Last Name</Label>
                                    <Input
                                    type="text" required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row id="user_pass" >
                            <Col id="user_name" >
                                <FormGroup>
                                    <Label>User Name</Label>
                                    <Input
                                    type="text" required
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    onBlur={() => validateUserName(username)}
                                    />
                                    {usernameError && (
                                        <div className="text-danger mt-1">{usernameError}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col id="pass" >
                                <FormGroup>
                                    <Label>Password</Label>
                                    <div className="input-group">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => validatePassword(password)}
                                        />
                                        <span
                                            className="input-group-text"
                                            onClick={handlePasswordToggle}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEyeSlash : faEye}
                                            />
                                        </span>
                                    </div>
                                    {passwordError && (
                                        <div className="text-danger mt-1">{passwordError}</div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => validateEmail(email)}
                                    />
                                    {emailError && (
                                        <div className="text-danger mt-1">{emailError}</div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>

                        {backendErrors.length > 0 && (
                            <Row className="error-summary alert alert-danger mb-4">
                                <Col>
                                    <h5>Please correct the following:</h5>
                                    <ul>
                                    {backendErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                    </ul>
                                </Col>
                            </Row>
                        )}

                    </CardBody>
                    <CardFooter>
                        <button type="submit">Register</button>
                    </CardFooter>
                </Card>
            </Form>
        </Container>
    )
}