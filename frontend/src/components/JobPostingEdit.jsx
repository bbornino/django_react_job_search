import React, { Component} from "react";
import axios from "axios";
import { JOB_POSTING_API_URL, JOB_SITE_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"
import Comments from "./Comments"

class JobPostingEdit extends Component {
    // All Default values are set here
    state = {
        job_posting_id: 0,
        job_site_id: 0,
        posting_title: '',
        company_name: '',
        posting_status: '4 - No Response',

        posting_url_full: '',
        posting_url_domain: '',
        posting_password: '',

        pay_range: '',
        location_city: '',
        location_type: '',
        employment_type: '',

        applied_at: '',
        interviewed_at: null,
        rejected_at: null,
        rejected_after_stage: 'Application Submission',

        job_scan_info: '',
        outreach_info: '',
        time_spent: '',
        
        technology_string: '',
        technology_stack: [],
        comments: [],
        posting_application_questions: [],
        job_description: 'TBD',

        job_sites: [],
    }

    getJobSites = e => {
        axios.get(JOB_SITE_API_URL).then( res => {
            this.setState({job_sites:res.data})
        });
    }

    getJobPosting = (jobPostingId) => {
        axios.get(JOB_POSTING_API_URL + jobPostingId).then(res => {
            // NOTE: Any attempted setting of defaults here are overwritten by the state = line above!
            this.setState({
                job_site_id: res.data.job_site_id,
                posting_title: res.data.posting_title,
                company_name: res.data.company_name,
                posting_status: res.data.posting_status,

                posting_url_full: res.data.posting_url_full,
                posting_url_domain: res.data.posting_url_domain,
                posting_password: res.data.posting_password,

                pay_range: res.data.pay_range,
                location_city: res.data.location_city,
                location_type: res.data.location_type,
                employment_type: res.data.employment_type,

                applied_at: formatInputFieldDateTime(res.data.applied_at),
                interviewed_at:  formatInputFieldDateTime(res.data.interviewed_at),
                rejected_at: formatInputFieldDateTime(res.data.rejected_at),
                rejected_after_stage: res.data.rejected_after_stage,

                job_scan_info: res.data.job_scan_info,
                outreach_info: res.data.outreach_info,
                time_spent: res.data.time_spent,

                technology_string: res.data.technology_string,
                technology_stack: {},
                comments: res.data.comments,
                posting_application_questions: {},
                job_description: res.data.job_description,
            })

            const descCard = document.getElementById("description_card_body")
            const ckeContent = descCard.querySelector(".ck-content")

            if (ckeContent !== null) {
                ckeContent.ckeditorInstance.setData(res.data.job_description)
            }

        })
    }

    componentDidMount() {
        const pathArr = window.location.pathname.split('/')
        
        if (pathArr[1] === "job-posting-new") {
            // Set the applied at date time to now, in correct format
            var currentdate = new Date().toLocaleDateString('en-CA')
            var currenttime = new Date().toLocaleTimeString('en-US', 
                    { hour12: false, 
                        hour: "numeric", 
                        minute: "numeric"})

            // use value to set the job_site_id IF recieved a job_site_id
            if(pathArr[2]) {
                this.setState({job_site_id:pathArr[2], 
                    applied_at: currentdate + 'T' + currenttime,
                })
            }
            
        } else {
            // NOT new.  Use as the posting id
            this.setState({job_posting_id:pathArr[2]});
            this.getJobPosting(pathArr[2]);
        }

        this.getJobSites();
    };

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    };

    onEditorChange = e => {
        const descCard = document.getElementById("description_card_body")
        const ckeContent = descCard.querySelector(".ck-content")
        const newVal = ckeContent.ckeditorInstance.getData()
        this.setState({job_description: newVal})
    };

    setCommentsCallback = (updatedComments) => {
        this.setState({comments: updatedComments})
    }

    onDeleteJobPosting = e => {
        axios.delete(JOB_POSTING_API_URL + this.state.job_posting_id,
            this.state).then(() => {
                window.location = document.referrer
        })
    }

    createJobPosting = e => {
        e.preventDefault();
        axios.post(JOB_POSTING_API_URL, this.state).then(() => {
            // Create always comes from the Job Site page
            window.location = document.referrer
        })
    }

    editJobPosting = e => {
        e.preventDefault();
        axios.put(JOB_POSTING_API_URL + this.state.job_posting_id,
            this.state).then(() => {
                // Once Saved, function like a back button!
                window.location = document.referrer
            })
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.state.job_posting_id === 0 ? this.createJobPosting : this.editJobPosting}>
                    <Card className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2">
                            <Row className="">
                                <Col xxl="9" xl="8" lg="8" md="7" sm="5" xs="3">
                                    {this.state.job_posting_id === 0 ? 'Create' : 'Edit'} Job Posting
                                </Col>
                                <Col xxl="3" xl="4" lg="4" md="5" sm="7" xs="9" className="pull-right">
                                    <Button color="danger" className="mx-2  pull-right" 
                                        onClick={this.onDeleteJobPosting}>
                                        <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete</Button>
                                    <Button color="primary" type="submit" className="mx-2 pull-right">
                                        <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save</Button>
                                </Col>
                            </Row>
                        </CardTitle>
                        <CardBody className="bg-white">
                            <Row id="title_source_status">
                                <Col lg="6" md="12">
                                    <FormGroup>
                                        <Label for="posting_title">Posting Title</Label>
                                        <Input
                                            type="text" required
                                            id="posting_title"
                                            name="posting_title"
                                            onChange={this.onChange}
                                            value={this.state.posting_title}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="job_site_id">Posting Job Site Source</Label>
                                        <Input
                                            type="select" required
                                            id="job_site_id"
                                            name="job_site_id"
                                            onChange={this.onChange}
                                            value={this.state.job_site_id}>
                                                <option value="">Select Job Site</option>
                                                {this.state.job_sites.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.site_name}
                                                    </option>
                                                    ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="posting_title">Posting Status</Label>
                                        <Input
                                            type="select" required
                                            id="posting_status"
                                            name="posting_status"
                                            onChange={this.onChange}
                                            value={this.state.posting_status}>
                                                <option value="4 - No Response">4 - No Response</option>
                                                <option value="3 - Rejected">3 - Rejected</option>
                                                <option value="2.5 - Post Interview Declined">2.5 - Post Interview Declined</option>
                                                <option value="2 - Awaiting Feedback">2 - Awaiting Feedback</option>
                                                <option value="1 - Actively Engaged">1 - Actively Engaged</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="company_url_password">
                                <Col lg="6" md="12">
                                    <FormGroup>
                                        <Label for="company_name">Company Name</Label>
                                        <Input
                                            type="text" required
                                            id="company_name"
                                            name="company_name"
                                            onChange={this.onChange}
                                            value={this.state.company_name}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col lg="4" md="6">
                                    <FormGroup>
                                        <Label for="posting_url_domain">Posting URL Domain</Label>
                                        <Input
                                            type="select" required
                                            id="posting_url_domain"
                                            name="posting_url_domain"
                                            onChange={this.onChange}
                                            value={this.state.posting_url_domain}>
                                                <option value="">Select Posting Domain</option>
                                                <option value="LinkedIn Easy Apply">LinkedIn Easy Apply</option>
                                                <option value="Indeed">Indeed</option>
                                                <option value="Greenhouse">Greenhouse</option>
                                                <option value="Workday Jobs">Workday Jobs</option>
                                                <option value="Lever">Lever</option>
                                                <option value="JobVite">JobVite</option>
                                                <option value="Bamboo HR">Bamboo HR</option>
                                                <option value="Custom / In House">Custom / In House</option>
                                                <option value="Other">Other</option>
                                        </Input>
                                        
                                    </FormGroup>
                                </Col>
                                <Col lg="2" md="6">
                                    <FormGroup>
                                        <Label for="posting_password">Posting Site Password</Label>
                                        <Input
                                            type="text"
                                            id="posting_password"
                                            name="posting_password"
                                            onChange={this.onChange}
                                            value={this.state.posting_password}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="full_url">
                                <Col lg="12" md="12">
                                    <FormGroup>
                                        <Label for="posting_url_full">Posting Full URL</Label>
                                        <Input
                                            type="text" required
                                            id="posting_url_full"
                                            name="posting_url_full"
                                            onChange={this.onChange}
                                            value={this.state.posting_url_full}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="pay_location_type">
                                <Col xl="4" lg="3" md="8">
                                    <FormGroup>
                                        <Label for="pay_range">Pay Range</Label>
                                        <Input
                                            type="text" required
                                            id="pay_range"
                                            name="pay_range"
                                            onChange={this.onChange}
                                            value={this.state.pay_range}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl="2" lg="3" md="4">
                                    <FormGroup>
                                        <Label for="employment_type">Employment Type</Label>
                                        <Input
                                            type="select" required
                                            id="employment_type"
                                            name="employment_type"
                                            onChange={this.onChange}
                                            value={this.state.employment_type} >
                                                <option value="">Select Type</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Contract">Contract</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col lg="4" md="8">
                                    <FormGroup>
                                        <Label for="location_city">Location City</Label>
                                        <Input
                                            type="text" required
                                            id="location_city"
                                            name="location_city"
                                            onChange={this.onChange}
                                            value={this.state.location_city}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="2" md="4">
                                    <FormGroup>
                                        <Label for="location_type">Location Type</Label>
                                        <Input
                                            type="select" required
                                            id="location_type"
                                            name="location_type"
                                            onChange={this.onChange}
                                            value={this.state.location_type}>
                                                <option value="">Select Type</option>
                                                <option value="Remote">Remote</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="On-Site">On-Site</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="dates">
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="applied_at">Applied At</Label>
                                        <Input
                                            type="datetime-local" required
                                            id="applied_at"
                                            name="applied_at"
                                            onChange={this.onChange}
                                            value={this.state.applied_at}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="interviewed_at">Interviewed At</Label>
                                        <Input
                                            type="datetime-local"
                                            id="interviewed_at"
                                            name="interviewed_at"
                                            onChange={this.onChange}
                                            value={this.state.interviewed_at}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="rejected_at">Rejected At</Label>
                                        <Input
                                            type="datetime-local"
                                            id="rejected_at"
                                            name="rejected_at"
                                            onChange={this.onChange}
                                            value={this.state.rejected_at}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" md="6">
                                    <FormGroup>
                                        <Label for="rejected_after_stage">Recruitment Stage</Label>
                                        <Input
                                            type="select"
                                            id="rejected_after_stage"
                                            name="rejected_after_stage"
                                            onChange={this.onChange}
                                            value={this.state.rejected_after_stage}>
                                                <option value="Application Submission">Application Submission</option>
                                                <option value="Screening">Screening</option>
                                                <option value="HR Interview">HR Interview</option>
                                                <option value="Code Test">Code Test</option>
                                                <option value="Hiring Manager Interview">Hiring Manager Interview</option>
                                                <option value="Team Interview">Team Interview</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" md="12">
                                    <FormGroup>
                                        <Label for="outreach_info">Outreach Names</Label>
                                        <Input
                                            type="text" required
                                            id="outreach_info"
                                            name="outreach_info"
                                            onChange={this.onChange}
                                            value={this.state.outreach_info}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl="4" lg="3" md="8">
                                    <FormGroup>
                                        <Label for="job_scan_info">Job Scan Percent</Label>
                                        <Input
                                            type="text" required
                                            id="job_scan_info"
                                            name="job_scan_info"
                                            onChange={this.onChange}
                                            value={this.state.job_scan_info}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl="2" lg="3" md="4">
                                    <FormGroup>
                                        <Label for="time_spent">Time Spent (minutes)</Label>
                                        <Input  type="number" required
                                                name="time_spent" id="time_spent"
                                                onChange={this.onChange}
                                                value={this.state.time_spent}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="technology_string_row">
                                <Col lg="12" md="12">
                                    <FormGroup>
                                        <Label for="technology_string">Technology</Label>
                                        <Input
                                            type="text" required
                                            id="technology_string"
                                            name="technology_string"
                                            onChange={this.onChange}
                                            value={this.state.technology_string}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card id="comments_card" className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2" ><strong>Job Posting Comments</strong></CardTitle>
                        <CardBody className="bg-white">
                            <Comments itemComments={this.state.comments} 
                                      onCommentsSave={this.setCommentsCallback} />
                        </CardBody>
                    </Card>
                    <Card id="description_card" className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2"><strong>Job Posting Description</strong></CardTitle>
                        <CardBody className="bg-white" id="description_card_body">
                            <Editor editorText={this.state.job_description} 
                                    onEditorChange={this.onEditorChange} ></Editor>
                        </CardBody>
                    </Card>
                </Form>

            </Container>
        )
    }
}

export default JobPostingEdit;