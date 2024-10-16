import {React, Component} from "react";
import axios from "axios";
import { JOB_SITE_API_URL } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';

class Dashboard extends Component {

    render() {
        return(
            <Container className="mt-2">
                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Job Hunt Statistics</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        Sample Data
                        <Row>
                            <Col></Col>
                            <Col>Postings Applied </Col>
                            <Col>Responses</Col>
                        </Row>
                        <Row>
                            <Col>March 1, 2024 (edit box?)</Col>
                            <Col>1,000</Col>
                            <Col>17</Col>
                        </Row>
                        <Row>
                            <Col>June 25, 2024 (edit box?)</Col>
                            <Col>300</Col>
                            <Col>10</Col>
                        </Row>
                    x postings since date x       pos response
                    y postings since date y       pos response
                    </CardBody>
                </Card>

                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Job Postings</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        small datatable here.  Default: show!  Linkable...
                    </CardBody>
                </Card>
                <Card id="active_opportunities" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Opportunities</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        small datatable here.  Default: hide?!  Linkable...
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default Dashboard;