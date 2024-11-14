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
                        <h2>November 14, 2024 - Release 3</h2>
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