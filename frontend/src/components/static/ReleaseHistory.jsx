import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class ReleaseHistory extends Component {
    componentDidMount() {
        document.title = "Release History - Job Search Tracker";
    }

    render() {
        return (
            <Container className="mt-4 p-t-10">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>Release History</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h2>March 20, 2025 - Release 5</h2>
                        <ul>
                            <li>Docker and Web Server Support (Nginx + Gunicorn)</li>
                            <li>Enabled Users to edit their name and password</li>
                            <li>Google Analytics</li>
                            <li>Added Job Site Cache</li>
                            <li>Enabled Django Logging</li>
                            <li>Moved to Production Database</li>
                            <li>Reduced Back end Requests (once instead of double render twice)</li>
                        </ul>
                        <h2>January 14, 2025 - Release 4</h2>
                        Added Multi-User Support!  Impacts:
                        <ul>
                            <li>Added back end custom user module and added user field to job postings, job sites, and opportunities</li>
                            <li>Added back end authentication, token refresh, and logout</li>
                            <li>New Login and Register Pages</li>
                            <li>New Menu organization dependant on whether logged in or not</li>
                            <li>Converted all Class Components to Functional Components</li>
                            <li>Enabled React.Fetch for API Authentication Tokens</li>
                        </ul>
                        <h2 className="mt-5">November 14, 2024 - Release 3</h2>
                        <ul>
                            <li>Added Dashboard with dynamically calculated statistics</li>
                            <li>Added Static Boolean Search Page</li>
                            <li>Added Additional Field Validations</li>
                            <li>Fixed a few minor bugs and a race condition</li>
                        </ul>

                        <h2 className="mt-5">October 25, 2024 - Release 2</h2>
                        <ul>
                            <li>Added Job Sites and Job Postings</li>
                            <li>Added Reports</li>
                            <li>Added Data Table Filters</li>
                            <li>Static Page Menu Consolidation</li>
                        </ul>

                        <h2 className="mt-5">September 11, 2024 - Release 1</h2>
                        <ul>
                            <li>Initial Release</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ReleaseHistory;