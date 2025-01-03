import React, { Component} from "react";
import axios from "axios";
import { JOB_SITE_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"

class JobSiteEdit extends Component {
    state = {
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
        
    }

    getJobSite = (job_site_id) => {
        // console.log("getJobSite received " + job_site_id)
        axios.get(JOB_SITE_API_URL + job_site_id).then(res => {

            const gitHubField = document.getElementById('github_field')
            gitHubField.checked = res.data.github_field
            const projectSiteField = document.getElementById('project_site_field')
            projectSiteField.checked = res.data.project_site_field

            this.setState({
                site_name: res.data.site_name,
                site_url: res.data.site_url,
                site_password: res.data.site_password,
                rating: res.data.rating,
                last_visited_at: formatInputFieldDateTime(res.data.last_visited_at),
                resume_updated_at: formatInputFieldDateTime(res.data.resume_updated_at),
                resume_format: res.data.resume_format === '' ? 'Both' : res.data.resume_format ,
                github_field: res.data.github_field,
                project_site_field: res.data.project_site_field,
                headline: res.data.headline,
                description: res.data.description,
            })

            const descCard = document.getElementById("description_group")
            const ckeContent = descCard.querySelector(".ck-content")
            if (ckeContent !== null) {
                ckeContent.ckeditorInstance.setData(res.data.description)
            }

        })
    }

    componentDidMount() {
        document.title = "Job Site Edit - Job Search Tracker";
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const job_site_id = pathArr[2]
            this.setState({job_site_id: pathArr[2]})
            this.getJobSite(job_site_id)
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };

    onCheckBoxChange = e => {
        this.setState({ [e.target.name]: e.target.checked ? true : false});
    }

    onEditorChange = e => {
        const collection = document.getElementsByClassName("ck-content")
        if (collection.length === 1) {
            const newVal = collection[0].ckeditorInstance.getData()
            this.setState({description: newVal})
        }
    };

    onDeleteJobSite = e => {
        console.log("Deleting Job Site")
        axios.delete(JOB_SITE_API_URL + this.state.job_site_id,
                    this.state).then(() => {
            window.location = '/job-sites'
        })
    }

    createJobSite = e => {
        e.preventDefault();
        axios.post(JOB_SITE_API_URL, this.state).then(() => {
            window.location = '/job-sites'
        })
    }

    editJobSite = e => {
        e.preventDefault();
        axios.put(JOB_SITE_API_URL + this.state.job_site_id, this.state)
            .then(() => {
                window.location = '/job-site-view/' + this.state.job_site_id
            })
    }

    render() {
        return (
            <Container className="flex">
                <Form onSubmit={this.state.job_site_id === 0 ? this.createJobSite : this.editJobSite} >
                    <Card className="text-dark bg-light m-3">
                        <CardTitle className="mx-4 my-2">
                            <Row>
                                <Col xxl="9" xl="8" lg="8" md="7" sm="5" xs="3">
                                    <strong>
                                        {this.state.job_site_id === 0 ? 'Create ' : 'Edit '}
                                         Job Site</strong>
                                </Col>
                                <Col xxl="3" xl="4" lg="4" md="5" sm="7" xs="9" className="pull-right">
                                    <Button color="danger" className="mx-2 pull-right" 
                                            onClick={this.onDeleteJobSite}>
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
                                                onChange={this.onChange}
                                                value={this.state.site_name ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col id="rating_field" lg="1" >
                                    <FormGroup>
                                        <Label for="rating">Rating</Label>
                                        <Input  type="number" required
                                                name="rating" id="rating"
                                                onChange={this.onChange}
                                                value={this.state.rating ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col id="site_url_field" lg="4" >
                                    <FormGroup>
                                        <Label for="site_url">Site URL</Label>
                                        <Input  type="text" required
                                                name="site_url" id="site_url"
                                                maxLength={64}
                                                onChange={this.onChange}
                                                value={this.state.site_url ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col id="site_password_field" lg="2" >
                                    <FormGroup>
                                        <Label for="site_password">Password</Label>
                                        <Input  type="text" required
                                                name="site_password" id="site_password"
                                                maxLength={64}
                                                onChange={this.onChange}
                                                value={this.state.site_password ?? ''}
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
                                            onChange={this.onChange}
                                            value={this.state.last_visited_at ?? ''} />
                                    </FormGroup>
                                </Col>
                                <Col id="resume_updated_field" lg="3" md="6">
                                    <FormGroup>
                                        <Label for="resume_updated_at">Resume Updated At</Label>
                                        <Input type="datetime-local" required
                                            name="resume_updated_at" id="resume_updated_at"
                                            onChange={this.onChange}
                                            value={this.state.resume_updated_at} />
                                    </FormGroup>
                                </Col>
                                <Col id="git_hub_group_field" lg="4" md="8">
                                    <FormGroup check inline>
                                        <Input type="checkbox"
                                            name="github_field" id="github_field"
                                            onChange={this.onCheckBoxChange}
                                            value={this.state.github_field} />
                                        <Label for="github_field">Has GitHub Field</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input type="checkbox"
                                            name="project_site_field" id="project_site_field"
                                            onChange={this.onCheckBoxChange}
                                            value={this.state.project_site_field} />
                                        <Label for="project_site_field">Has Project Site Field</Label>
                                    </FormGroup>
                                </Col>
                                <Col lg="2" >
                                    <FormGroup>
                                        <Label for="">Resume Format</Label>
                                        <Input
                                            type="select" required
                                            name="" id=""
                                            onChange={this.onChange}
                                            value={this.state.resume_format ?? ''}>
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
                                                onChange={this.onChange}
                                                value={this.state.headline ?? ''}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row id="description_row">
                                <Col>
                                    <FormGroup id="description_group">
                                        <Label>Description</Label>
                                        <Editor editorText={this.state.description}
                                            onEditorChange={this.onEditorChange}></Editor>  
                                    </FormGroup>

                                    
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Form>
            </Container>
        )
    }
}

export default JobSiteEdit;