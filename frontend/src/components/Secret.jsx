import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class Secret extends Component {
    componentDidMount() {
        document.title = "Release History - Job Search Tracker";
    }

    render() {
        return (
            <Container className="mt-4 p-t-10">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>SUPER SECRET PAGE!</h1>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Secret;