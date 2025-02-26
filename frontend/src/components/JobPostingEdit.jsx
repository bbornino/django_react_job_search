import React, { useState, useEffect, useCallback, useRef  } from "react";
import { useNavigate } from 'react-router-dom';
import { JOB_POSTING_API_URL, JOB_SITE_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk, faEraser } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"
import Comments from "./Comments"
import { useApiRequest } from "../useApiRequest";

const JobPostingEdit = () => {

    // All Default values are set here
    const [state, setState] = useState({
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
        interviewed_at: '',
        rejected_at: '',
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
    });

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const hasFetchedJobSites = useRef(false);  // Track if the request has already been made
    const hasFetchedJobPosting = useRef(false);  // Track if the request has already been made

    const getJobSites = useCallback(async () => {
        if (hasFetchedJobSites.current) return; // Prevent double fetch
        hasFetchedJobSites.current = true;

        const jobSites = await apiRequest(JOB_SITE_API_URL, {method: 'GET'})
        if (jobSites) {
            setState((prevState) => ({
                ...prevState,
                job_sites: jobSites
            }))
        }
    }, [apiRequest]);

    const getJobPosting = useCallback(async(jobPostingId) => {
        if (hasFetchedJobPosting.current) return; // Prevent double fetch
        hasFetchedJobPosting.current = true;

        if(!jobPostingId) return;
        const data = await apiRequest(JOB_POSTING_API_URL + jobPostingId, {method: 'GET'});

        if (data) {
            setState((prevState) => ({
                // NOTE: Any attempted setting of defaults here are overwritten by the state = line above!
                ...prevState,
                job_site_id: data.job_site_id,
                posting_title: data.posting_title,
                company_name: data.company_name,
                posting_status: data.posting_status,

                posting_url_full: data.posting_url_full,
                posting_url_domain: data.posting_url_domain,
                posting_password: data.posting_password,

                pay_range: data.pay_range,
                location_city: data.location_city,
                location_type: data.location_type,
                employment_type: data.employment_type,

                applied_at: formatInputFieldDateTime(data.applied_at),
                interviewed_at:  formatInputFieldDateTime(data.interviewed_at),
                rejected_at: formatInputFieldDateTime(data.rejected_at),
                rejected_after_stage: data.rejected_after_stage,

                job_scan_info: data.job_scan_info,
                outreach_info: data.outreach_info,
                time_spent: data.time_spent,

                technology_string: data.technology_string,
                technology_stack: {},
                comments: data.comments,
                posting_application_questions: {},
                job_description: data.job_description,
            }))

            //Race Condition! sometimes, this is triggered before... CKEditor is ready?!
            // WAIT for things to settle down before loading the data into CKEditor
            setTimeout(() => {
                // Code to execute after 0.1 seconds (300 milliseconds)
                const descCard = document.getElementById("description_card_body")
                const ckeContent = descCard.querySelector(".ck-content")

                if (ckeContent !== null) {
                    ckeContent.ckeditorInstance.setData(data.job_description)
                }
              }, 100); 
        }
    }, [apiRequest]);

    useEffect(() => {
        document.title = "Job Posting Edit - Job Search Tracker";
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
                setState((prevState) => ({
                    ...prevState,
                    job_site_id:pathArr[2], 
                    applied_at: currentdate + 'T' + currenttime,
                }))
            }
            
        } else {
            // NOT new.  Use as the posting id
            setState((prevState) => ({
                ...prevState,
                job_posting_id:pathArr[2]
            }))
            getJobPosting(pathArr[2]);
        }

        getJobSites();
    }, [getJobPosting, getJobSites]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const onEditorChange = () => {
        const descCard = document.getElementById("description_card_body")
        const ckeContent = descCard.querySelector(".ck-content")
        const newVal = ckeContent.ckeditorInstance.getData()
        setState((prevState) => ({ ...prevState, job_description: newVal }));
    };

    const setCommentsCallback = (updatedComments) => {
        setState((prevState) => ({ ...prevState, comments: updatedComments }));
    }

    const onDeleteJobPosting = async () => {
        await apiRequest(JOB_POSTING_API_URL  + state.job_posting_id, state, { method: 'DELETE' });
        navigate(-1);       // go back one navigational page
    }

    const clearJobPosting = () => {
        const descCard = document.getElementById("description_card_body")
        const ckeContent = descCard.querySelector(".ck-content")

        if (ckeContent !== null) {
            ckeContent.ckeditorInstance.setData('')
        }

        setState((prevState) => ({
            // NOTE: Any attempted setting of defaults here are overwritten by the state = line above!
            ...prevState,
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

            job_scan_info: '',
            outreach_info: '',
            time_spent: '',

            technology_string: '',
            technology_stack: [],
            comments: [],
            posting_application_questions: [],
            job_description: '',
        }))
    }

    const createJobPosting = async (e) => {
        e.preventDefault();
        const jobPostingParams = state

        jobPostingParams.interviewed_at = jobPostingParams.interviewed_at === '' ? null : jobPostingParams.interviewed_at
        jobPostingParams.rejected_at = jobPostingParams.rejected_at === '' ? null : jobPostingParams.rejected_at
        await apiRequest(JOB_POSTING_API_URL, jobPostingParams, {method: 'POST'});
        navigate(-1, { state: { refresh: true } });

    }

    const editJobPosting = async (e) => {
        e.preventDefault();
        const jobPostingData = state;
        await apiRequest(JOB_POSTING_API_URL + state.job_posting_id, jobPostingData, {method: 'PUT'});
        navigate(-1);       // go back one navigational page
    }


    return (
        <Container>
            <Form onSubmit={state.job_posting_id === 0 ? createJobPosting : editJobPosting}>
                <Card className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <Row className="">
                            <Col xxl="8" xl="8" lg="7" md="7" sm="5" xs="3">
                                {state.job_posting_id === 0 ? 'Create' : 'Edit'} Job Posting
                            </Col>
                            <Col xxl="4" xl="4" lg="5" md="5" sm="7" xs="9" className="pull-right">
                                <Button color="warning" className="mx-2  pull-right" 
                                    onClick={clearJobPosting}>
                                    <FontAwesomeIcon icon={faEraser} /> &nbsp; Clear</Button>
                                <Button color="danger" className="mx-2  pull-right" 
                                    onClick={onDeleteJobPosting}>
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
                                        maxLength={128}
                                        onChange={handleInputChange}
                                        value={state.posting_title || ''}
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
                                        onChange={handleInputChange}
                                        value={state.job_site_id || ''}>
                                            <option value="">Select Job Site</option>
                                            {state.job_sites.map((option) => (
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
                                        onChange={handleInputChange}
                                        value={state.posting_status || ''}>
                                            <option value="4 - No Response">4 - No Response</option>
                                            <option value="3 - Rejected">3 - Rejected</option>
                                            <option value="2.5 - Post Interview Declined">2.5 - Post Interview Declined</option>
                                            <option value="2.4 - Post Interview Declined">2.4 - Post Interview Silence</option>
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
                                        maxLength={64}
                                        onChange={handleInputChange}
                                        value={state.company_name || ''}
                                    />
                                </FormGroup>
                            </Col>

                            <Col lg="4" md="6">
                                <FormGroup>
                                    <Label for="posting_url_domain">Posting URL Domain</Label>
                                    <Input
                                        type="select" required
                                        id="posting_url_domain"
                                        maxLength={32}
                                        name="posting_url_domain"
                                        onChange={handleInputChange}
                                        value={state.posting_url_domain || ''}>
                                            <option value="">Select Posting Domain</option>
                                            <option value="LinkedIn Easy Apply">LinkedIn Easy Apply</option>
                                            <option value="Dice Easy Apply">Dice Easy Apply</option>
                                            <option value="Indeed">Indeed</option>
                                            <option value="Greenhouse">Greenhouse</option>
                                            <option value="My Workday Jobs">My Workday Jobs</option>
                                            <option value="Lever">Lever</option>
                                            <option value="ICIMS">ICIMS</option>
                                            <option value="JobVite">JobVite</option>
                                            <option value="Bamboo HR">Bamboo HR</option>
                                            <option value="Breezy HR">Breezy HR</option>
                                            <option value="Cal Careers">Cal Careers</option>
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
                                        maxLength={32}
                                        onChange={handleInputChange}
                                        value={state.posting_password || ''}
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
                                        maxLength={1024}
                                        onChange={handleInputChange}
                                        value={state.posting_url_full || ''}
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
                                        maxLength={64}
                                        onChange={handleInputChange}
                                        value={state.pay_range || ''}
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
                                        onChange={handleInputChange}
                                        value={state.employment_type || ''} >
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
                                        maxLength={64}
                                        onChange={handleInputChange}
                                        value={state.location_city || ''}
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
                                        onChange={handleInputChange}
                                        value={state.location_type || ''}>
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
                                        onChange={handleInputChange}
                                        value={state.applied_at || ''}
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
                                        onChange={handleInputChange}
                                        value={state.interviewed_at || ''}
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
                                        onChange={handleInputChange}
                                        value={state.rejected_at || ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg="3" md="6">
                                <FormGroup>
                                    <Label for="rejected_after_stage">Recruitment Stage</Label>
                                    <Input
                                        type="select" required
                                        id="rejected_after_stage"
                                        name="rejected_after_stage"
                                        onChange={handleInputChange}
                                        value={state.rejected_after_stage || ''}>
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
                                        type="text"
                                        id="outreach_info"
                                        name="outreach_info"
                                        onChange={handleInputChange}
                                        value={state.outreach_info || ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xl="4" lg="3" md="8">
                                <FormGroup>
                                    <Label for="job_scan_info">Job Scan Percent</Label>
                                    <Input
                                        type="text" 
                                        id="job_scan_info"
                                        name="job_scan_info"
                                        onChange={handleInputChange}
                                        value={state.job_scan_info || ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xl="2" lg="3" md="4">
                                <FormGroup>
                                    <Label for="time_spent">Time Spent (minutes)</Label>
                                    <Input  type="number" required
                                            name="time_spent" id="time_spent"
                                            onChange={handleInputChange}
                                            value={state.time_spent || ''}
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
                                        maxLength={128}
                                        onChange={handleInputChange}
                                        value={state.technology_string || ''}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card id="comments_card" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2" ><strong>Job Posting Comments</strong></CardTitle>
                    <CardBody className="bg-white">
                        <Comments itemComments={state.comments || []} 
                                    onCommentsSave={setCommentsCallback} />
                    </CardBody>
                </Card>
                <Card id="description_card" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2"><strong>Job Posting Description</strong></CardTitle>
                    <CardBody className="bg-white" id="description_card_body">
                        <Editor editorText={state.job_description || ''} 
                                onEditorChange={onEditorChange} ></Editor>
                    </CardBody>
                </Card>
            </Form>

        </Container>
    )

}

export default JobPostingEdit;