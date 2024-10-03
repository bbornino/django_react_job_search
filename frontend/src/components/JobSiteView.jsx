import React, { Component} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { JOB_SITE_API_URL, formatDisplayDateTime } from "../constants";
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk, faPencil, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

class JobSiteView extends Component {
    state = {
        job_site_id: 0,
        description: '',
        headline: '',
        last_visited_at: '',
        rating: '',
        resume_updated_at: '',
        site_name: '',
        site_url: '',
    };

    componentDidMount() {
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const jobSiteId = pathArr[2]
            this.setState({job_site_id: pathArr[2]})
            this.getJobSite(jobSiteId)
        }
    };


    getJobSite = (jobSiteId) => {
        console.log("getJobSite received " + jobSiteId);
        axios.get(JOB_SITE_API_URL + jobSiteId).then(res => {
            this.setState({
                job_site_id: res.data.id,
                site_name: res.data.site_name,
                site_url: res.data.site_url,
                rating: res.data.rating,
                last_visited_at: formatDisplayDateTime(res.data.last_visited_at),
                resume_updated_at: formatDisplayDateTime(res.data.resume_updated_at),
                headline: res.data.headline,
                description: res.data.description,
            })

        })
    }

    onEditClicked = (r,e) => {
        window.location = '/job-site-edit/' + this.state.job_site_id
    }

    onNewPostingClicked = (r, e) => {
        window.location = '/job-posting-new/' + this.state.job_site_id
    }

    render() {

        return (
            <Container className="mt-2">
                <Card className="text-dark bg-light m-3">
                    <CardTitle className="mx-2 my-2">
                        <Row className="m-2">
                            <Col xxl="10" xl="9" lg="8" md="7" sm="5" xs="3">
                                <h1>{this.state.site_name}</h1>
                            </Col>
                            <Col xxl="2" xl="3" lg="4" md="5" sm="7" xs="9" className="pull-right">
                                <Button color="success" type="button"
                                        className="m-2"
                                        onClick={this.onEditClicked}>
                                    <FontAwesomeIcon icon={faPencil} /> &nbsp; Edit
                                </Button>
                            </Col>
                        </Row>
                    </CardTitle>
                    
                    <CardBody className="bg-white">
                        <Row>
                            <Col>
                                <dl>
                                    <dt>URL</dt>
                                    <dd>
                                        <Link to='{this.state.site_url}'>
                                            {this.state.site_url}
                                        </Link>
                                    </dd>
                                </dl>
                            </Col>
                            <Col>
                                <dl>
                                    <dt>Rating</dt>
                                    <dd>{this.state.rating}</dd>
                                </dl>
                            </Col>
                            <Col>
                                <dl>
                                    <dt>Last Visited</dt>
                                    <dd>{this.state.last_visited_at}</dd>
                                </dl>
                            </Col>
                            <Col>
                                <dl>
                                    <dt>Resume Last Updated</dt>
                                    <dd>{this.state.resume_updated_at}</dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <dl>
                                    <dt>Headline</dt>
                                    <dd>{this.state.headline}</dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <dl>
                                    <dt>Description</dt>
                                    <dd><div dangerouslySetInnerHTML={{ __html: this.state.description }} /></dd>
                                </dl>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                
                <Card className="text-dark bg-light m-3">
                    <CardTitle className="mx-2 my-1">
                        <Row className="m-1">
                            <Col xxl="10" xl="9" lg="8" md="7" sm="6" xs="6" >
                                <h3>Job Site Postings Applied</h3>
                            </Col>
                            <Col xxl="2" xl="3" lg="4" md="5" sm="6" xs="6" className="pull-right">
                                <Button color="success" type="button"
                                        onClick={this.onNewPostingClicked}>
                                    <FontAwesomeIcon icon={faSquarePlus} /> &nbsp; Add New
                                </Button>
                            </Col>
                        </Row>
                    </CardTitle>
                    <CardBody className="bg-white">
                        <Row>
                            <Col>
                                Table Here!
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default JobSiteView;
