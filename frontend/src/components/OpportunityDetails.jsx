import React, { Component} from "react";
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"
import Comments from "./Comments"

class OpportunityDetails extends Component {
    // All Default values are set here
    state = {
        opportunity_id: 0,
        job_title: '',
        opportunity_status: '6 - Opportunity Ignored',
        recruiter_name: '',
        recruiter_company: '',
        
        email_received_at: '',
        employment_type: '',
        job_duration: '',
        location_type: '',
        location_city: '',

        comments: [],
        job_description: '',

    }

    getOpportunity = (opportunity_id) => {
        // console.log("getOpportunity received " + opportunity_id)
        axios.get(JOB_OPPORTUNITY_API_URL + opportunity_id).then(res => {
            // NOTE: Any attempted setting of defaults here are overwritten by the state = line above!
            this.setState({
                job_title: res.data.job_title,
                opportunity_status: res.data.opportunity_status,
                recruiter_name: res.data.recruiter_name,
                recruiter_company: res.data.recruiter_company,
                
                email_received_at: formatInputFieldDateTime(res.data.email_received_at),
                employment_type: res.data.employment_type,
                job_duration: res.data.job_duration,
                location_type: res.data.location_type,
                location_city: res.data.location_city,

                comments: res.data.comments,
                job_description: res.data.job_description,
            })

            //Race Condition! sometimes, this is triggered before... CKEditor is ready?!
            // WAIT for things to settle down before loading the data into CKEditor
            setTimeout(() => {
                // Code to execute after 0.1 seconds (100 milliseconds)
                console.log("Hello after 0.1 second");
                const descCard = document.getElementById("description_card_body")
                const ckeContent = descCard.querySelector(".ck-content")
                if(ckeContent) ckeContent.ckeditorInstance.setData(res.data.job_description)
              }, 100); 
            
        });
        
    };
    
    componentDidMount() {
        document.title = "Opportunity Details - Job Search Tracker";
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
        const descCard = document.getElementById("description_card_body")
        const ckeContent = descCard.querySelector(".ck-content")
        const newVal = ckeContent.ckeditorInstance.getData()
        this.setState({job_description: newVal})
    }

    onDeleteOpportunity = e => {
        console.log("Deleting Opportunity")
        axios.delete(JOB_OPPORTUNITY_API_URL + this.state.opportunity_id, 
                    this.state).then(() => {
            window.location = '/opportunities'
        })
    }

    createOpportunity = e => {
        e.preventDefault();
        axios.post(JOB_OPPORTUNITY_API_URL, this.state).then(() => {
            window.location = '/opportunities'
        })
    }

    editOpportunity = e => {
        e.preventDefault();
        axios.put(JOB_OPPORTUNITY_API_URL + this.state.opportunity_id, this.state)
            .then(() => {
            window.location = document.referrer
        })
    }
    
    setCommentsCallback = (updatedComments) => {
        this.setState({comments: updatedComments})
    }

    render() {
        return (
            <Container className="flex">
                <Form onSubmit={this.state.opportunity_id === 0 ? this.createOpportunity : this.editOpportunity} >
                    <Card className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2" >
                            <Row className="">
                                <Col xxl="9" xl="8" lg="8" md="7" sm="5" xs="3">
                                    <strong>Opportunity Details</strong>
                                </Col>
                                <Col xxl="3" xl="4" lg="4" md="5" sm="7" xs="9" className="pull-right">
                                    <Button color="danger" className="mx-2  pull-right" 
                                        onClick={this.onDeleteOpportunity}>
                                        <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete</Button>
                                    <Button color="primary" type="submit" className="mx-2 pull-right">
                                        <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save</Button>
                                </Col>
                            </Row>    
                        </CardTitle>
                        <CardBody className="bg-white">
                            <Row id="status_recruiter_row">
                                <Col lg="3" md="6" id="recruiter_name_field">
                                    <FormGroup>
                                        <Label for="recruiter_name">Recruiter Name</Label>
                                        <Input
                                            type="text" required
                                            id="recruiter_name"
                                            name="recruiter_name"
                                            maxLength={64}
                                            onChange={this.onChange}
                                            value={this.state.recruiter_name}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6" id="recruiter_company_field">
                                    <FormGroup>
                                        <Label for="recruiter_company">Recruiter Company</Label>
                                        <Input
                                            type="text" required
                                            name="recruiter_company"
                                            maxLength={64}
                                            onChange={this.onChange}
                                            value={this.state.recruiter_company}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6" id="opportunity_status_field">
                                    <FormGroup>
                                        <Label for="opportunity_status">Status</Label>
                                        <Input
                                            type="select" required
                                            name="opportunity_status"
                                            onChange={this.onChange}
                                            value={this.state.opportunity_status} >
                                                <option value="6 - Opportunity Ignored">6 - Opportunity Ignored</option>
                                                <option value="5 - Showed Opportunity Interest">5 - Showed Opportunity Interest</option>
                                                <option value="4 - Recruiter Ignored Interest">4 - Recruiter Ignored Interest</option>
                                                <option value="3 - Right to Represent Signed">3 - Right to Represent Signed</option>
                                                <option value="4 - No Response">4 - No Response</option>
                                                <option value="3 - Rejected">3 - Rejected</option>
                                                <option value="2 - Awaiting Feedback">2 - Awaiting Feedback</option>
                                                <option value="1 - Actively Engaged">1 - Actively Engaged</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="email_received_at">Email Received At</Label>
                                        <Input type="datetime-local" required
                                            name="email_received_at"
                                            onChange={this.onChange}
                                            value={this.state.email_received_at} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="title_empl_type_duriation_row">
                                <Col lg="6" md="12">
                                    <FormGroup>
                                        <Label for="job_title">Job Title</Label>
                                        <Input
                                            type="text" required
                                            name="job_title"
                                            maxLength={128}
                                            onChange={this.onChange}
                                            value={this.state.job_title}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="employment_type">Employment Type</Label>
                                        <Input
                                            type="select" required
                                            name="employment_type"
                                            onChange={this.onChange}
                                            value={this.state.employment_type} >
                                                <option value="">Select Type</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Freelance">Freelance</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="job_duration">Contract Duration</Label>
                                        <Input
                                            type="text" required
                                            name="job_duration"
                                            maxLength={64}
                                            onChange={this.onChange}
                                            value={this.state.job_duration ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="location_type_city">
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="location_type">Location Type</Label>
                                        <Input
                                            type="select" required
                                            name="location_type"
                                            onChange={this.onChange}
                                            value={this.state.location_type} >
                                                <option value="">Select Type</option>
                                                <option value="On-Site">On-Site</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="Remote">Remote</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="location_city">Location City</Label>
                                        <Input
                                            type="text" required
                                            name="location_city"
                                            maxLength={64}
                                            onChange={this.onChange}
                                            value={this.state.location_city}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2" ><strong>Opportunity Comments</strong></CardTitle>
                        <CardBody className="bg-white">
                            <Comments itemComments={this.state.comments} 
                                      onCommentsSave={this.setCommentsCallback} />
                        </CardBody>
                    </Card>
                    <Card id="description_card" className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2"><strong>Opportunity Job Description</strong></CardTitle>
                        <CardBody id="description_card_body" className="bg-white">
                            <Editor editorText={this.state.job_description} 
                                    onEditorChange={this.onEditorChange} ></Editor>
                        </CardBody>
                    </Card>
                    
                </Form>
                    
            </Container>
        )
    }
}

export default OpportunityDetails;
