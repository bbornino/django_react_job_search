import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Row, Col} from 'reactstrap';

const Welcome = () => {
  return (
    <Container className="d-flex justify-content-center align-items-start vh-100" style={{ marginTop: '5%' }}>
        <div className="p-4 border rounded shadow-lg text-center" style={{ maxWidth: '500px', width: '100%' }}>
            <Row className="mb-3">
                <Col>
                    <h1>Welcome to Job Search Tracker!</h1>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <p>
                    The job hunt is exhausting. And it can be difficult to keep track of all of the different sites where you can find jobs
                    and all of the job listings you have applied to. This app helps the user track all of their job applications and
                    opportunities in one convenient place.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex flex-column gap-3">
                    <Link to="/login" className="btn btn-primary">
                    Log In
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                    Sign Up
                    </Link>
                    <Link to="/about" className="btn btn-link">
                    Learn More About Us
                    </Link>
                </Col>
            </Row>
        </div>
    </Container>
  );
};

export default Welcome;
