import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";  // Correct hook to handle login
import axios from "axios";
// import Cookies from "js-cookie"; 
import { Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input } from "reactstrap";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error handling state
  const navigate = useNavigate(); // Hook to navigate after login
  const signIn = useSignIn(); // Use useSignIn hook to handle login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the POST request to your Django login API (replace URL with your Django endpoint)
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      const response = await axios.post(`${apiUrl}auth/login/`, { username, password });

      // Assuming the response contains the token and user info
      const { access, refresh, user } = response.data;

      // Store the access token in LocalStorage
      localStorage.setItem("access_token", access);

      // Call signIn from react-auth-kit
      const isSignedIn = signIn({
        token: refresh,
        expiresIn: 3600, // Token expiration time in seconds
        tokenType: "Bearer",
        authState: user, // Save user info
        sameSite: 'None',       // This allows the cookie to be sent in cross-origin requests
      });

      if (!isSignedIn) {
        throw new Error("Failed to sign in. Please try again.");
      }

      navigate("/dashboard");  // Redirect to the protected page after successful login

    } catch (error) {
      // Check if the error response contains a message to display
      if (error.response && error.response.data.error && error.response.data.detail) {
        setError(error.response.data.detail); // Display backend error message
      } else {
        setError(error.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container className="centered-container">
      <Form onSubmit={handleLogin}>
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardTitle><strong>Login</strong></CardTitle>
          <CardBody>
            <FormGroup>
              <Label>User Name</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message */}
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
