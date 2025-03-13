import React, { useState, useEffect, useCallback, useRef, useMemo  } from "react";
import { useNavigate } from 'react-router-dom';
import {  useAuthUser, useIsAuthenticated, useSignOut  } from 'react-auth-kit';
import {Form, FormGroup, FormText, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody, CardFooter} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useApiRequest } from "utils/useApiRequest";

const UserProfileEdit = () => {
    const [user, setUser] = useState({
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        bio: '',
        user_greeting: '',
        color_mode: 'light',
        dashboard_first_date: '',
        dashboard_second_date: ''
    });

    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const authUser = useAuthUser(); // Hook to get the user object
    const userData = useMemo(() => authUser(), [authUser]); // Get user data only when authUser changes
    
    useEffect(() => {
        document.title = "User Profile Edit - Job Search Tracker";
        if (userData) {
            setUser((prevUser) => ({
                ...prevUser,
                id: userData.id || '',
                username: userData.username || '',
                email: userData.email || '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                bio: userData.bio || '',
                user_greeting: userData.user_greeting || '',
                color_mode: userData.color_mode || 'light',
                dashboard_first_date: userData.dashboard_first_date || '',
                dashboard_second_date: userData.dashboard_second_date || ''
            }));
        }
    }, [userData])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const updateUserProfile = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.REACT_APP_API_URL + 'custom_user/update/';
            // await apiRequest(apiUrl, user, {method:'PATCH'});
            const response = await apiRequest(apiUrl, user, { 
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            
            console.log('Profile updated successfully');
            // navigate('/profile');  // Redirect to profile page or another desired page
          } catch (err) {
            console.error('Error updating profile:', err);
          }
    }

    return(
        <Container>
            <Form onSubmit={updateUserProfile}>
                <Card className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        Edit Profile
                    </CardTitle>
                    <CardBody className="bg-white">
                        <Row id="name">
                            <Col lg="6" md="12">
                                <FormGroup>
                                    <Label for="">First Name</Label>
                                    <Input
                                        type="text" required
                                        id="first_name"
                                        name="first_name"
                                        maxLength={150}
                                        onChange={handleInputChange}
                                        value={user.first_name || ''}
                                        />
                                </FormGroup>
                            </Col>
                            <Col lg="6" md="12">
                                <FormGroup>
                                    <Label for="">Last Name</Label>
                                    <Input
                                        type="text" required
                                        id="last_name"
                                        name="last_name"
                                        maxLength={150}
                                        onChange={handleInputChange}
                                        value={user.last_name || ''}
                                        />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row id="email_user">
                            <Col lg="6" md="12">
                                <FormGroup>
                                    <Label for="">Email Address</Label>
                                    <Input
                                        type="text" required
                                        id="email"
                                        name="email"
                                        maxLength={254}
                                        onChange={handleInputChange}
                                        value={user.email || ''}
                                        />
                                </FormGroup>
                            </Col>
                            <Col lg="3" md="6">
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input type="text"
                                        name="username" 
                                        id="username"  
                                        value={user.username || ""}
                                        disabled  readOnly />
                                    <FormText color="muted">This is your username and cannot be edited.</FormText>
                                </FormGroup>
                            </Col>
                            <Col lg="3" md="6">
                                <FormGroup>
                                <Label>New Password</Label>
                                    <div className="position-relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            maxLength={128}
                                            onChange={handleInputChange}
                                            value={user.password || ""}
                                            placeholder="Enter new password"
                                        />
                                        <Button
                                            type="button"
                                            className="position-absolute end-0 top-50 translate-middle-y me-2"
                                            style={{ border: "none", background: "transparent" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </Button>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className="bg-white">
                        <Row>
                            <Col>
                                <Button type="submit" color="primary">
                                    Save Changes
                                </Button>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Form>
        </Container>
    )
}

export default UserProfileEdit;