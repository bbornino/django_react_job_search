import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import {Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input} from 'reactstrap';

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Define setError state
    const navigate = useNavigate(); // Declare navigate here
    const enableAuth = process.env.REACT_APP_ENABLE_AUTH === 'true';  // Read from environment

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!enableAuth) {
            alert("Authentication is currently disabled.");
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/login/', { username, password });

            // Store the tokens in localStorage or sessionStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate("/secret");
        } catch (error) {
            debugger
            if (error.response && error.response.data.error) {
                setError(error.response.data.error); // Show error message from backend
            } else {
                setError('An error occurred. Please try again.');
            }
        }
      };


  return (
    <Container className="centered-container">
        <Form onSubmit={handleSubmit}>
            <Card className="text-dark bg-light m-3 card-narrow">
                <CardTitle><strong>Login</strong></CardTitle>
                <CardBody>
                    <FormGroup>
                        <Label>User Name</Label>
                        <Input type="text"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </FormGroup>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </CardBody>
                <CardFooter>
                    <button type="submit">Login</button>
                </CardFooter>
            </Card>
        </Form>

    </Container>
  );
};

export default Login;
