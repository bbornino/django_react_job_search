import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";  // Correct hook to handle login
import axios from "axios";
import { Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input } from "reactstrap";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error handling state
  const navigate = useNavigate(); // Hook to navigate after login
  const signIn = useSignIn(); // Use useSignIn hook to handle login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the POST request to your Django login API (replace URL with your Django endpoint)
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}auth/login/`, { username, password });


      // Assuming the response contains the token and user info
      const { access_token, user } = response.data;

      // Call the signIn function from react-auth-kit to manage the JWT token
      signIn({
        token: access_token,
        expiresIn: 3600,  // Set the token expiration time (in seconds)
        tokenType: "Bearer",
        authState: { user },  // Set the user info to store in the app state
      });

      navigate("/secret");  // Redirect to the protected page after successful login

    } catch (error) {
      // Check if the error response contains a message to display
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Display backend error message
      } else {
        setError("An error occurred. Please try again."); // General error message
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
