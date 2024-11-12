import React, { Component} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { JOB_SITE_API_URL, formatDisplayDateTime, formatDisplayDate } from "../constants";
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import DataTableBase from './DataTableBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

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
        postings: [],
    };

    componentDidMount() {
        document.title = "Job Site View - Job Search Tracker";
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const jobSiteId = pathArr[2];
            this.setState({job_site_id: pathArr[2]});
            this.getJobSite(jobSiteId);
            this.getJobSitePostings(jobSiteId);
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

    getJobSitePostings = (JobSiteId) => {
        axios.get(JOB_SITE_API_URL + JobSiteId + '/postings' ).then(res => {
            this.setState({
                postings: res.data,
            })
            console.log(this.state)
        });
    }

    columns = [
        {
            name: 'Company Name',
            selector: row => row.company_name,
            sortable: true,
        },
        {
            name: 'Posting Title',
            selector: row => row.posting_title,
            sortable: true,
        },
        {
            name: 'Posting Status',
            selector: row => row.posting_status,
            sortable: true,
        },
        {
            name: 'Applied At',
            id: 'applied_at',
            selector: row => row.applied_at,
            cell: row => formatDisplayDateTime(row.applied_at),
            width: "250px",
            sortable: true,
        },
    ]

    onRowClicked = (row, event) => {
        window.location = '/job-posting-edit/' + row.id
    };

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
                            <Col xl="10" md="9" sm="8" xs="6">
                                <h1>{this.state.site_name}</h1>
                            </Col>
                            <Col xl="2" md="3" sm="4" xs="6" className="pull-right">
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
                            <Col lg="3" xs="6">
                                <dl>
                                    <dt>URL</dt>
                                    <dd>
                                        <Link to='{this.state.site_url}'>
                                            {this.state.site_url}
                                        </Link>
                                    </dd>
                                </dl>
                            </Col>
                            <Col lg="3" xs="6">
                                <dl>
                                    <dt>Rating</dt>
                                    <dd>{this.state.rating}</dd>
                                </dl>
                            </Col>
                            <Col lg="3" xs="6">
                                <dl>
                                    <dt>Last Visited</dt>
                                    <dd>{formatDisplayDate(this.state.last_visited_at)}</dd>
                                </dl>
                            </Col>
                            <Col lg="3" xs="6">
                                <dl>
                                    <dt>Resume Last Updated</dt>
                                    <dd>{formatDisplayDate(this.state.resume_updated_at)}</dd>
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
                            <Col xl="10" md="9" sm="8" xs="6" >
                                <h3>Job Site Postings Applied</h3>
                            </Col>
                            <Col xl="2" md="3" sm="4" xs="6" className="pull-right">
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
                                <DataTableBase  columns={this.columns}
                                    data={this.state.postings}
                                    defaultSortFieldId="applied_at"
                                    defaultSortAsc={false}
                                    onRowClicked={this.onRowClicked} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default JobSiteView;
