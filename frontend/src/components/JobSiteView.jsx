import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiRequest } from '../utils/useApiRequest';
import { JOB_SITE_API_URL, formatDisplayDateTime, formatDisplayDate } from "../constants";
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import DataTableBase from './DataTableBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

const JobSiteView = () => {
    const [state, setState] = useState({
        job_site_id: 0,
        description: '',
        headline: '',
        last_visited_at: '',
        rating: '',
        resume_updated_at: '',
        site_name: '',
        site_url: '',
        postings: [],
    });

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const hasFetchedJobSite = useRef(false);  // Track if the request has already been made
    const hasFetchedPostings = useRef(false);  // Track if the request has already been made

    const getJobSite = useCallback ( async (jobSiteId) => {
        if (hasFetchedJobSite.current) return; // Prevent double fetch
        hasFetchedJobSite.current = true;

        if (!jobSiteId) return;

        const data = await apiRequest(`${JOB_SITE_API_URL}${jobSiteId}`, {method:'GET'});
        if (!data) return;
        if (data) {
            setState((prevState) => ({
                ...prevState,
                job_site_id: data.id,
                site_name: data.site_name,
                site_url: data.site_url,
                rating: data.rating,
                last_visited_at: formatDisplayDateTime(data.last_visited_at),
                resume_updated_at: formatDisplayDateTime(data.resume_updated_at),
                headline: data.headline,
                description: data.description,
            }))
        }
    }, [apiRequest]);

    const getJobSitePostings = useCallback(async (jobSiteId) => {
        if (hasFetchedPostings.current) return; // Prevent double fetch
        hasFetchedPostings.current = true;

        if (!jobSiteId) return;
    
        const data = await apiRequest(JOB_SITE_API_URL + jobSiteId + '/postings', { method: 'GET' });
        // console.log("getJobSitePostings response:", data); // Debug log
        if (!data || !Array.isArray(data)) {
            console.warn("Invalid or missing data for job site postings");
            setState((prevState) => ({
                ...prevState,
                postings: [], // Fallback to an empty array
            }));
            return;
        }
    
        setState((prevState) => ({
            ...prevState,
            postings: data,
        }));
    }, [apiRequest]);

    useEffect(() => {
        document.title = "Job Site View - Job Search Tracker";
        const pathArr = window.location.pathname.split('/');
    
        if (pathArr.length > 2 && pathArr[2]) {
            const jobSiteId = pathArr[2];
            setState((prevState) => ({
                ...prevState,
                job_site_id: jobSiteId,
            }));
            Promise.all([getJobSite(jobSiteId), getJobSitePostings(jobSiteId)])
            .catch((error) => console.error("Error fetching job site data:", error));
        }
    }, [getJobSite, getJobSitePostings]);

    const columns = [
        {
            name: 'Company Name',
            selector: row => (typeof row?.company_name === 'string' ? row.company_name : 'N/A'),
            sortable: true,
        },
        {
            name: 'Posting Title',
            selector: row => (typeof row?.posting_title === 'string' ? row.posting_title : 'N/A'),
            sortable: true,
        },
        {
            name: 'Posting Status',
            selector: row => (typeof row?.posting_status === 'string' ? row.posting_status : 'N/A'),
            sortable: true,
            width: "200px",
        },
        {
            name: 'Applied At',
            id: 'applied_at',
            selector: row => (typeof row?.applied_at === 'string' ? row.applied_at : 'N/A'),
            cell: row => formatDisplayDateTime(row?.applied_at),
            width: "250px",
            sortable: true,
        },
    ]

    const onRowClicked = (row, event) => {
        navigate('/job-posting-edit/' + row.id);
    };

    const onEditClicked = (r,e) => {
        if (!state.job_site_id) {
            console.error("Job site ID is not defined");
            return;
        }
        navigate('/job-site-edit/' + state.job_site_id);
    }

    const onNewPostingClicked = (r, e) => {
        if (!state.job_site_id) {
            console.error("Job site ID is not defined");
            return;
        }
        navigate('/job-posting-new/' + state.job_site_id);
    }

    if (!state) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-2">
            <Card className="text-dark bg-light m-3">
                <CardTitle className="mx-2 my-2">
                    <Row className="m-2">
                        <Col xl="10" md="9" sm="8" xs="6">
                            <h1>{state.site_name}</h1>
                        </Col>
                        <Col xl="2" md="3" sm="4" xs="6" className="pull-right">
                            <Button color="success" type="button"
                                    className="m-2"
                                    onClick={onEditClicked}>
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
                                    <Link to='{state.site_url}'>
                                        {state.site_url}
                                    </Link>
                                </dd>
                            </dl>
                        </Col>
                        <Col lg="3" xs="6">
                            <dl>
                                <dt>Rating</dt>
                                <dd>{state.rating}</dd>
                            </dl>
                        </Col>
                        <Col lg="3" xs="6">
                            <dl>
                                <dt>Last Visited</dt>
                                <dd>{formatDisplayDate(state.last_visited_at)}</dd>
                            </dl>
                        </Col>
                        <Col lg="3" xs="6">
                            <dl>
                                <dt>Resume Last Updated</dt>
                                <dd>{formatDisplayDate(state.resume_updated_at)}</dd>
                            </dl>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <dl>
                                <dt>Headline</dt>
                                <dd>{state.headline}</dd>
                            </dl>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <dl>
                                <dt>Description</dt>
                                <dd><div dangerouslySetInnerHTML={{ __html: state.description }} /></dd>
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
                                    onClick={onNewPostingClicked}>
                                <FontAwesomeIcon icon={faSquarePlus} /> &nbsp; Add New
                            </Button>
                        </Col>
                    </Row>
                </CardTitle>
                <CardBody className="bg-white">
                    <Row>
                        <Col>
                            <DataTableBase  columns={columns}
                                data={state.postings}
                                defaultSortFieldId="applied_at"
                                defaultSortAsc={false}
                                onRowClicked={onRowClicked} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    )

}

export default JobSiteView;
