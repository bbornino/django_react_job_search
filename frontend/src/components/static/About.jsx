import React, { useEffect, useRef } from "react";
import { Container, Row, Col } from "reactstrap";

const About = () => {
    const menuRef = useRef(null); // Ref to the dropdown menu
    const activeElementRef = useRef(null); // Ref to track focused element

    // Effect to manage focus when the component mounts/unmounts
    useEffect(() => {
        // Track the currently focused element
        document.title = "About this Application - Job Search Tracker";
        const activeElement = document.activeElement;
        activeElementRef.current = activeElement;

        // Copy the current value of menuRef to a variable for cleanup
        const menuElement = menuRef.current;

        // Cleanup to ensure focus is removed if necessary
        return () => {
            if (menuElement && menuElement.contains(activeElementRef.current)) {
                activeElementRef.current.blur(); // Remove focus if it's on a hidden element
            }
        };
    }, []); // Empty array to run on mount/unmount only

    return (
        <Container className="mt-4 p-t-10">
            <Row className="mb-3 text-center">
                <h1>About this Application</h1>
            </Row>

            <Row>
                <Col>
                    <p>
                        The job hunt is exhausting... This application helps track all job postings that 
                        have been applied to and all of the direct opportunities sent by recruiters.
                    </p>
                    <p>Some of the high-level features of this application include:</p>
                    <ul>
                        <li>Comments - Create, Read, Edit, and Delete</li>
                        <li>Job Opportunity WYSIWYG Editor (CKEditor5)</li>
                        <li>Reports and Statistics</li>
                        <li>Multi-User Support</li>
                        <li>Docker Support</li>
                    </ul>
                    <p>This application is built using the following technologies:</p>
                    <ul>
                        <li>Front End: React.js Single Page Application</li>
                        <ul>
                            <li>react-router-dom</li>
                            <li>Bootstrap (using react-strap)</li>
                            <li>react-data-table-component</li>
                            <li>CK Editor 5</li>
                            <li>Font Awesome</li>
                            <li>React-auth-kit</li>
                            <li>Google Analytics</li>
                        </ul>
                        <li>Python Django REST framework</li>
                        <ul>
                            <li>CORSheaders</li>
                            <li>REST Framework Simple JWT (and Tokens)</li>
                            <li>Django Logging</li>
                            <li>Django Core Cache: LocMemCache </li>
                        </ul>
                        <li>Database: AWS LightSail WordPress MariaDB</li>
                        <li>Docker: Nginx & Gunicorn</li>
                    </ul>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
