import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";  // Correct hook to handle login
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
    const navigate = useNavigate();

    const handlePasswordToggle = () => {
        setShowPassword((prevState) => !prevState);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/register", {
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
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col id="last_name" >
                                <FormGroup>
                                    <Label>Last Name</Label>
                                    <Input
                                    type="text"
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
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    />
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
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <button type="submit">Register</button>
                    </CardFooter>
                </Card>
            </Form>
        </Container>
    )
}