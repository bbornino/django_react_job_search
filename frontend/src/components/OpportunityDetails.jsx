import React, { Component} from "react";
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";
import {Form, FormGroup, Input, Label, Button, ButtonGroup, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"

class OpportunityDetails extends Component {
    state = {
        opportunity_id: 0,
        recruiter_name: '',
        job_title: '',
        opportunity_status: '4 - No Response',
        recruiter_company: '',
        job_description: '',
    }

    constructor(props) {
        super(props)
    }

    getOpportunity = (opportunity_id) => {
        // console.log("getOpportunity received " + opportunity_id)
        axios.get(JOB_OPPORTUNITY_API_URL + opportunity_id).then(res => {
            this.setState({recruiter_name: res.data.recruiter_name,
                recruiter_company: res.data.recruiter_company,
                job_title: res.data.job_title,
                opportunity_status: res.data.opportunity_status,
                job_description: res.data.job_description,
            })
            const collection = document.getElementsByClassName("ck-content")
            if ( collection.length != 0) {
                collection[0].ckeditorInstance.setData(res.data.job_description)
            }
        });
    };
    
    componentDidMount() {
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const opportunity_id = pathArr[2]
            this.setState({opportunity_id: pathArr[2]})
            this.getOpportunity(opportunity_id)
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onEditorChange = e => {
        const collection = document.getElementsByClassName("ck-content")
        const newVal = collection[0].ckeditorInstance.getData()
        this.setState({job_description: newVal})
    }

    createOpportunity = e => {
        e.preventDefault();
        axios.post(JOB_OPPORTUNITY_API_URL, this.state).then(() => {
            window.location = '/opportunities/'
        })
    }

     editOpportunity = e => {
        e.preventDefault();
        axios.put(JOB_OPPORTUNITY_API_URL + this.state.opportunity_id, this.state).then(() => {
            window.location = '/opportunities/'
        })
    }

    render() {
        return (
            <Container className="flex">
                <Card className="my-3">

                    <CardBody>
                        <Form onSubmit={this.state.opportunity_id == 0 ? this.createOpportunity : this.editOpportunity} >
                            
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
                            <Row>
                                <Col md="3">
                                    <FormGroup>
                                        <Label for="recruiter_name">Recruiter Name</Label>
                                        <Input
                                            type="text" required
                                            name="recruiter_name"
                                            onChange={this.onChange}
                                            value={this.state.recruiter_name ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3">
                                    <FormGroup>
                                        <Label for="recruiter_company">Recruiter Company</Label>
                                        <Input
                                            type="text" required
                                            name="recruiter_company"
                                            onChange={this.onChange}
                                            value={this.state.recruiter_company ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3">
                                    <FormGroup>
                                        <Label for="opportunity_status">Status</Label>
                                        <Input
                                            type="select" required
                                            name="opportunity_status"
                                            onChange={this.onChange}
                                            value={this.state.opportunity_status ?? ''} >
                                                <option value="4 - No Response">4 - No Response</option>
                                                <option value="3 - Rejected">3 - Rejected</option>
                                                <option value="2 - Awaiting Feedback">2 - Awaiting Feedback</option>
                                                <option value="1 - Actively Engaged">1 - Actively Engaged</option>
                                        </Input>
                                    </FormGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="job_title">Job Title</Label>
                                        <Input
                                            type="text" required
                                            name="job_title"
                                            onChange={this.onChange}
                                            value={this.state.job_title ?? ''}
                                        />
                                    </FormGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Label >Job Description</Label>
                                        <Editor editorText={this.state.job_description} onEditorChange={this.onEditorChange} ></Editor>
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
