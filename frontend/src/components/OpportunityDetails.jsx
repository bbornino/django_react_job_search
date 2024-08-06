import {React, Component, setState} from "react";
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";
import {Form, FormGroup, Input, Label, Button, ButtonGroup, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'



class OpportunityDetails extends Component {
    state = {
        pk: 0,
        recruiter_name: '',
        job_title: '',
        opportunity_status: '4 - No Response',
        recruiter_company: '',
        job_description: '',
    }

    componentDidMount() {
        if (this.props.opportunity) {
            const {pk, recruiter_name, job_title, opportunity_status, 
                recruiter_company, job_description} = this.props.opportunity;
                this.setState({pk, recruiter_name, job_title, opportunity_status, 
                    recruiter_company, job_description});
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    createOpportunity = e => {
        e.preventDefault();
        axios.post(JOB_OPPORTUNITY_API_URL, this.state).then(() => {
            this.props.resetState();
        })
    }

    editOpportunity = e => {
        e.preventDefault();
        axios.put(JOB_OPPORTUNITY_API_URL + this.state.pk, this.state).then(() => {
            this.props.resetState();
        })
    }

    defaultIfEmpty = value => {
        return value === "" ? "" : value;
    };

    render() {
        return (
            <Container className="flex">
                <Card className="my-3">
                    <CardTitle>
                        <Row className="my-3 mx-3">
                            <Col md="6" sm="9" xs="6">
                                <h3>Opportunity Details</h3>
                            </Col>
                            <Col md="6" sm="3" xs="6" className="pull-right">
                                <Button color="danger" className="mx-2  pull-right" >
                                    <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete</Button>
                                <Button color="primary" type="submit" className="mx-2 pull-right">
                                    <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save</Button>
                                
                            </Col>
                        </Row>
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={this.props.opportunity ? this.editOpportunity : this.createOpportunity} >
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="recruiter_name">Recruiter Name</Label>
                                        <Input
                                            type="text"
                                            name="recruiter_name"
                                            onChange={this.onChange}
                                            value={this.defaultIfEmpty(this.state.recruiter_name)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="recruiter_company">Recruiter Company</Label>
                                        <Input
                                            type="text"
                                            name="recruiter_company"
                                            onChange={this.onChange}
                                            value={this.defaultIfEmpty(this.state.recruiter_company)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="job_title">Job Title</Label>
                                        <Input
                                            type="text"
                                            name="job_title"
                                            onChange={this.onChange}
                                            value={this.defaultIfEmpty(this.state.job_title)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="opportunity_status">Status</Label>
                                        <Input
                                            type="text"
                                            name="opportunity_status"
                                            onChange={this.onChange}
                                            value={this.defaultIfEmpty(this.state.opportunity_status)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default OpportunityDetails;
