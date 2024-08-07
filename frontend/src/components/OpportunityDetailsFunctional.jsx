import React, { Component, setState, getState, useState, useEffect} from "react";
import {useParams , renderMatches} from "react-router-dom";
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";
import {Form, FormGroup, Input, Label, Button, ButtonGroup, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const OpportunityDetails = () => {

    const [opportunity_id, setOpportunityId] = useState(0)
    const [recruiter_name, setRecruiterName] = useState('')
    const [job_title, setJobTitle] = useState('')
    const [recruiter_company, setRecruiterCompany] = useState('')
    const [opportunity_status, setOpportunityStatus] = useState('')
    const [job_description, setJobDescription] = useState('')



    const getOpportunity = (opportunity_id) => {
        debugger
        axios.get(JOB_OPPORTUNITY_API_URL + opportunity_id).then(res => {
            debugger
            setRecruiterName(res.data.recruiter_name)
            setJobTitle(res.data.job_title)
            setRecruiterCompany(res.data.recruiter_company)
            setOpportunityStatus(res.data.opportunity_status)
            setJobDescription(res.data.job_description)

        });
    };
    
    const pathArr = window.location.pathname.split('/')

    if (pathArr[2] !== undefined) {
        opportunity_id = pathArr[2]


            // setOpportunityId(opportunityId)

        
        // getOpportunity(opportunity_id)
    }

    const componentDidMount = () => {
        debugger
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const opportunity_id = pathArr[2]
            setOpportunityId(opportunity_id)
            getOpportunity(opportunity_id)
        }
    }

    const onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    const createOpportunity = e => {
        e.preventDefault();
        axios.post(JOB_OPPORTUNITY_API_URL, this.state).then(() => {
            window.location = '/opportunities/'
        })
    }

    const editOpportunity = e => {
        e.preventDefault();
        axios.put(JOB_OPPORTUNITY_API_URL + this.state.opportunity_id, this.state).then(() => {
            window.location = '/opportunities/'
        })
    }

    
    return (
        <Container className="flex">
            <Card className="my-3">

                <CardBody>
                    <Form onSubmit={opportunity_id == 0 ? createOpportunity : editOpportunity} >
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
                            <Col md="6">
                                <FormGroup>
                                    <Label for="recruiter_name">Recruiter Name</Label>
                                    <Input
                                        type="text" required
                                        name="recruiter_name"
                                        onChange={setRecruiterName}
                                        value={recruiter_name ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="recruiter_company">Recruiter Company</Label>
                                    <Input
                                        type="text" required
                                        name="recruiter_company"
                                        onChange={() => setRecruiterCompany}
                                        value={recruiter_company ?? ''}
                                    />
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
                                        onChange={setJobTitle}
                                        value={job_title ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="opportunity_status">Status</Label>
                                    <Input
                                        type="text" required
                                        name="opportunity_status"
                                        onChange={setOpportunityStatus}
                                        value={opportunity_status ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="job_description">Job Description</Label>
                                    <Input
                                        type="text" required
                                        name="job_description"
                                        onChange={setJobDescription}
                                        value={job_description ?? ''}
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

export default OpportunityDetails;
