import {React, Component} from "react";
import axios from "axios";
import { JOB_SITE_API_URL } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';

class Dashboard extends Component {
    componentDidMount() {
        document.title = "Dashboard - Job Search Tracker";
    }

    render() {
        return(
            <Container className="mt-2">
                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Job Hunt Statistics</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        Static Data As of October 25, 2024<br/><br/>
                        <Row>
                            <Col></Col>
                            <Col>Postings Applied </Col>
                            <Col>Responses</Col>
                            <Col>Response Rate</Col>
                        </Row>
                        <Row>
                            <Col>March 1, 2024 (edit box?)</Col>
                            <Col>933</Col>
                            <Col>17</Col>
                            <Col>1.8%</Col>
                        </Row>
                        <Row>
                            <Col>June 25, 2024 (edit box?)</Col>
                            <Col>237</Col>
                            <Col>5</Col>
                            <Col>2.1%</Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Job Postings</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        small datatable here with linkable rows...
                    </CardBody>
                </Card>
                <Card id="active_opportunities" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Opportunities</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        small datatable here with linkable rows...
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default Dashboard;