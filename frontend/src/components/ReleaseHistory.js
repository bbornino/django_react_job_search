import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class ReleaseHistory extends Component {
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
                        <h2>October 25, 2024 - Release 2</h2>
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