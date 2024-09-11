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
                        <ul>
                            <li><strong>September 11, 2024 Release 1:</strong> Initial Release</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ReleaseHistory;