import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { JOB_SITE_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"
import { useApiRequest } from "../utils/useApiRequest";

const JobSiteEdit = () => {

    const [state, setState] = useState({
        job_site_id: 0,
        site_name: '',
        site_url: '',
        site_password: '',
        rating: '',
        last_visited_at: '',
        resume_updated_at: '',
        resume_format: 'Both',
        github_field: false,
        project_site_field: false,
        headline: '',
        description: '',
    });

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();

    // Load job site data based on job_site_id
    const getJobSite = useCallback(async (job_site_id) => {
        if (!job_site_id) return;
        
        const data = await apiRequest(JOB_SITE_API_URL + job_site_id, {method:'GET'});
        if (data) {
            setState((prevState) => ({
                ...prevState,
                site_name: data.site_name,
                site_url: data.site_url,
                site_password: data.site_password,
                rating: data.rating,
                last_visited_at: formatInputFieldDateTime(data.last_visited_at),
                resume_updated_at: formatInputFieldDateTime(data.resume_updated_at),
                resume_format: data.resume_format === '' ? 'Both' : data.resume_format ,
                github_field: data.github_field,
                project_site_field: data.project_site_field,
                headline: data.headline,
                description: data.description,
            }))

            // Properly check the checkboxes
            const gitHubField = document.getElementById('github_field')
            gitHubField.checked = data.github_field
            const projectSiteField = document.getElementById('project_site_field')
            projectSiteField.checked = data.project_site_field

            const descCard = document.getElementById("description_group")
            const ckeContent = descCard.querySelector(".ck-content")
            if (ckeContent !== null) {
                ckeContent.ckeditorInstance.setData(data.description)
            }
        }
    }, [apiRequest]); // `apiRequest` should be stable, hence it goes in the dependency array

    // Only trigger getJobSite when job_site_id changes
    useEffect(() => {
        document.title = "Job Site Edit - Job Search Tracker";
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const job_site_id = pathArr[2]
            setState({job_site_id: pathArr[2]})
            getJobSite(job_site_id)
        }
    }, [state.job_site_id, getJobSite]);  // Including getJobSite as a dependency

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const onCheckBoxChange = (e) => {
        const { name } = e.target;
        setState((prevState) => ({ ...prevState, [name]: e.target.checked ? true : false }));
    }

    const onEditorChange = () => {
        const collection = document.getElementsByClassName("ck-content")
        if (collection.length === 1) {
            const newVal = collection[0].ckeditorInstance.getData()
            setState((prevState) => ({ ...prevState, description: newVal }));
        }
    };

    const onDeleteJobSite = async (e) => {
        e.preventDefault();
        console.log("Deleting Job Site")
        await apiRequest(JOB_SITE_API_URL + state.job_site_id,state, {method: 'DELETE'});
        navigate('/job-sites');
    }

    const createJobSite = async (e) => {
        e.preventDefault();
        await apiRequest(JOB_SITE_API_URL, state, {method:'POST'});
        navigate('/job-sites');
    }

    const editJobSite = async (e) => {
        e.preventDefault();
        await apiRequest(JOB_SITE_API_URL + state.job_site_id, state, {method: 'PUT'});
        navigate(-1, { state: { refresh: true } });
    }

    return (
        <Container className="flex">
            <Form onSubmit={state.job_site_id === 0 ? createJobSite : editJobSite} >
                <Card className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <Row>
                            <Col xxl="9" xl="8" lg="8" md="7" sm="5" xs="3">
                                <strong>
                                    {state.job_site_id === 0 ? 'Create ' : 'Edit '}
                                        Job Site</strong>
                            </Col>
                            <Col xxl="3" xl="4" lg="4" md="5" sm="7" xs="9" className="pull-right">
                                <Button color="danger" className="mx-2 pull-right" 
                                        onClick={onDeleteJobSite}>
                                    <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete
                                </Button>
                                <Button color="primary" type="submit" 
                                        className="mx-2 pull-right" >
                                    <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save
                                </Button>
                            </Col>
                        </Row>
                    </CardTitle>

                    <CardBody className="bg-white" >
                        <Row id="name_url_row">
                            <Col id="site_name_field" lg="5" >
                                <FormGroup>
                                    <Label for="site_name">Site Name</Label>
                                    <Input  type="text" required
                                            name="site_name" id="site_name"
                                            maxLength={64}
                                            onChange={handleInputChange}
                                            value={state.site_name ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col id="rating_field" lg="1" >
                                <FormGroup>
                                    <Label for="rating">Rating</Label>
                                    <Input  type="number" required
                                            name="rating" id="rating"
                                            onChange={handleInputChange}
                                            value={state.rating ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col id="site_url_field" lg="4" >
                                <FormGroup>
                                    <Label for="site_url">Site URL</Label>
                                    <Input  type="text" required
                                            name="site_url" id="site_url"
                                            maxLength={64}
                                            onChange={handleInputChange}
                                            value={state.site_url ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col id="site_password_field" lg="2" >
                                <FormGroup>
                                    <Label for="site_password">Password</Label>
                                    <Input  type="text" required
                                            name="site_password" id="site_password"
                                            maxLength={64}
                                            onChange={handleInputChange}
                                            value={state.site_password ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row id="dates_row">
                            <Col id="last_visted_field" lg="3" md="6">
                                <FormGroup>
                                    <Label for="last_visited_at">Last Visited At</Label>
                                    <Input type="datetime-local" required
                                        name="last_visited_at" id="last_visited_at"
                                        onChange={handleInputChange}
                                        value={state.last_visited_at ?? ''} />
                                </FormGroup>
                            </Col>
                            <Col id="resume_updated_field" lg="3" md="6">
                                <FormGroup>
                                    <Label for="resume_updated_at">Resume Updated At</Label>
                                    <Input type="datetime-local" required
                                        name="resume_updated_at" id="resume_updated_at"
                                        onChange={handleInputChange}
                                        value={state.resume_updated_at} />
                                </FormGroup>
                            </Col>
                            <Col id="git_hub_group_field" lg="4" md="8">
                                <FormGroup check inline>
                                    <Input type="checkbox"
                                        name="github_field" id="github_field"
                                        onChange={onCheckBoxChange}
                                        value={state.github_field} />
                                    <Label for="github_field">Has GitHub Field</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Input type="checkbox"
                                        name="project_site_field" id="project_site_field"
                                        onChange={onCheckBoxChange}
                                        value={state.project_site_field} />
                                    <Label for="project_site_field">Has Project Site Field</Label>
                                </FormGroup>
                            </Col>
                            <Col lg="2" >
                                <FormGroup>
                                    <Label for="">Resume Format</Label>
                                    <Input
                                        type="select" required
                                        name="" id=""
                                        onChange={handleInputChange}
                                        value={state.resume_format ?? ''}>
                                            <option value="Both">Both</option>
                                            <option value="PDF Only">PDF Only</option>
                                            <option value="Builder Only">Builder Only</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row id="headline_row">
                            <Col>
                                <FormGroup>
                                    <Label for="headline">Headline</Label>
                                    <Input  type="text" required
                                            name="headline" id="headline"
                                            maxLength={64}
                                            onChange={handleInputChange}
                                            value={state.headline ?? ''}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row id="description_row">
                            <Col>
                                <FormGroup id="description_group">
                                    <Label>Description</Label>
                                    <Editor editorText={state.description}
                                        onEditorChange={onEditorChange}></Editor>  
                                </FormGroup>

                                
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Container>
    )

}

export default JobSiteEdit;