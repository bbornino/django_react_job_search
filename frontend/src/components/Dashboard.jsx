import React, { useState, useEffect, useCallback, useRef   } from 'react';
import { Container, Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { DASHBOARD_API_URL, JOB_POSTING_API_URL, JOB_OPPORTUNITY_API_URL } from "../constants";
import { useApiRequest } from '../utils/useApiRequest'; // Import the hook
import { formatDisplayDate } from '../constants'; 
import DataTableBase from './DataTableBase';

const Dashboard = () => {
    const [activeJobPostings, setActiveJobPostings] = useState([]);
    const [activeOpportunities, setActiveOpportunities] = useState([]);
    const [statisticsBlock, setStatisticsBlock] = useState('');
    const { apiRequest } = useApiRequest();
    const hasFetchedJobHuntStatistics = useRef(false);  // Track if the request has already been made
    const hasFetchedActiveJobPostings = useRef(false);  // Track if the request has already been made
    const hasFetchedActiveOpportunities = useRef(false);  // Track if the request has already been made

    const getJobHuntStatistics = useCallback(async () => {
        if (hasFetchedJobHuntStatistics.current) return; // Prevent double fetch
        hasFetchedJobHuntStatistics.current = true;
        const response = await apiRequest(`${DASHBOARD_API_URL}`, {method:'GET'});
        if (response) {
            const statistics = response.map((statistics_row) => (
                <Row className="my-1" key={statistics_row.formatted_date}>
                    <Col>{statistics_row.formatted_date}</Col>
                    <Col>{statistics_row.total_count}</Col>
                    <Col>{statistics_row.response_count}</Col>
                    <Col>{(100 * statistics_row.response_count / statistics_row.total_count).toFixed(1)}%</Col>
                </Row>
            ));
            setStatisticsBlock(statistics);
        }
    }, [apiRequest]);

    const getActiveJobPostings = useCallback(async () => {
        if (hasFetchedActiveJobPostings.current) return; // Prevent double fetch
        hasFetchedActiveJobPostings.current = true;
        const response = await apiRequest(`${JOB_POSTING_API_URL}active`, {method:'GET'});
        if (response) {
            setActiveJobPostings(response);
        }
    }, [apiRequest]);

    const getActiveOpportunities = useCallback(async () => {
        if (hasFetchedActiveOpportunities.current) return; // Prevent double fetch
        hasFetchedActiveOpportunities.current = true;
        const response = await apiRequest(`${JOB_OPPORTUNITY_API_URL}active`, {method:'GET'});
        if (response) {
            setActiveOpportunities(response);
        }
    }, [apiRequest]);

    useEffect(() => {
        document.title = "Dashboard - Job Search Tracker";
        getJobHuntStatistics();
        getActiveJobPostings();
        getActiveOpportunities();
    }, [getJobHuntStatistics, getActiveJobPostings, getActiveOpportunities]);

    const onActiveJobPostingRowClicked = (row) => {
        window.location = '/job-posting-edit/' + row.id;
    };

    const jobPostingListColumns = [
        {
            name: "Company Name",
            selector: row => row.company_name,
            sortable: true,
        },
        {
            name: "Posting Title",
            selector: row => row.posting_title,
            sortable: true,
        },
        {
            name: "Posting Status",
            id: 'posting_status',
            selector: row => row.posting_status,
            sortable: true,
        },
        {
            name: "Posting Stage",
            selector: row => row.rejected_after_stage,
            sortable: true,
        },
        {
            name: "Applied On",
            id: 'applied_at',
            selector: row => row.applied_at,
            cell: row => formatDisplayDate(row.applied_at),
            sortable: true,
            width: "150px",
        },
    ];

    const onActiveOpportunityRowClicked = (row) => {
        window.location = '/opportunity-details/' + row.id;
    };

    const opportunityListColumns = [
        {
            name: 'Title',
            selector: row => row.job_title,
            sortable: true,
        },
        {
            name: 'Recruiter Name',
            selector: row => String(row.recruiter_name),
            sortable: true,
            width: "200px",
        },
        {
            name: 'Status',
            selector: row => row.opportunity_status,
            sortable: true,
            width: "300px",
        },
        {
            name: "Received At",
            selector: row => row.email_received_at,
            cell: row => formatDisplayDate(row.email_received_at),
            sortable: true,
            id:'email_received_at',
            width: "150px",
        },
    ];

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Container className="mt-2">
            <Card id="active_postings" className="text-dark bg-light m-3">
                <CardTitle className="mx-4 my-2">
                    <strong>Job Hunt Statistics</strong>
                </CardTitle>
                <CardBody className="bg-white">
                    <p>Data as of {currentDate}</p>
                    <Row>
                        <Col></Col>
                        <Col>Postings Applied </Col>
                        <Col>Responses</Col>
                        <Col>Response Rate</Col>
                    </Row>
                    {statisticsBlock}
                </CardBody>
            </Card>

            <Card id="active_postings" className="text-dark bg-light m-3">
                <CardTitle className="mx-4 my-2">
                    <strong>Active Job Postings</strong>
                </CardTitle>
                <CardBody className="bg-white">
                    <DataTableBase  
                        columns={jobPostingListColumns}
                        data={activeJobPostings}
                        paginationPerPage={20}
                        defaultSortFieldId="applied_at"
                        noDataComponent="No Active Job Postings"
                        defaultSortAsc={true}
                        onRowClicked={onActiveJobPostingRowClicked} />
                </CardBody>
            </Card>
            <Card id="active_opportunities" className="text-dark bg-light m-3">
                <CardTitle className="mx-4 my-2">
                    <strong>Active Opportunities</strong>
                </CardTitle>
                <CardBody className="bg-white">
                    <DataTableBase  
                        columns={opportunityListColumns}
                        data={activeOpportunities}
                        paginationPerPage={20}
                        defaultSortFieldId="posting_status"
                        noDataComponent="No Active Opportunities"
                        defaultSortAsc={true}
                        onRowClicked={onActiveOpportunityRowClicked} />
                </CardBody>
            </Card>
        </Container>
    );
};

export default Dashboard;
