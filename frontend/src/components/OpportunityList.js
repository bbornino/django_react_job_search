import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiRequest } from '../utils/useApiRequest';
import { JOB_OPPORTUNITY_API_URL, formatDisplayDateTime } from "../constants";

import DataTableBase from './shared/DataTableBase';
import { Button, Container, Row, Col } from 'reactstrap';

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const hasFetched = useRef(false);  // Track if the request has already been made

    // Memoize the getOpportunities function to avoid re-renders due to function change
    const getOpportunities = useCallback(async () => {
        if (hasFetched.current) return; // Prevent double fetch
        hasFetched.current = true;

        const data = await apiRequest(
            JOB_OPPORTUNITY_API_URL,
            { method: 'GET' }
        );
        if (data) {
            setOpportunities(data);
        } else {
            console.error('Failed to fetch opportunities');
        }
    }, [apiRequest]); // Adding apiRequest as a dependency

    useEffect(() => {
        document.title = "Opportunity List - Job Search Tracker";
        getOpportunities(); // Call the memoized getOpportunities function
    }, [getOpportunities]); // Including getOpportunities in the dependency array


    const columns = [
        {
            name: 'Title',
            selector: row => row.job_title,
            sortable: true,
        },
        {
            name: 'Opportunity Status',
            selector: row => String(row.opportunity_status),
            sortable: true,
        },
        {
            name: 'Recruiter Name',
            selector: row => String(row.recruiter_name),
            sortable: true,
        },
        {
            name: 'Recruiter Company',
            selector: row => String(row.recruiter_company),
            sortable: true,
        },
        {
            name: 'City',
            selector: row => row.location_city,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.location_type,
            sortable: true,
            width: "120px",
        },
        {
            name: 'Employment Type',
            selector: row => row.employment_type,
            sortable: true,
            width: "150px",
        },
        {
            name: "Received At",
            selector: row => row.email_received_at,
            cell: row => formatDisplayDateTime(row.email_received_at),
            sortable: true,
            id: 'email_received_at',
            width: "250px",
        },
    ];

    const onRowClicked = (row, event) => {
        navigate('/opportunity-details/' + row.id);
    };

    return (
        <Container fluid className="full-width-page">
            <Row className="m-4">
                <Col xxl="10" xl="9" lg="9" md="8" sm="5" xs="3">
                    <h1>All Opportunities</h1>
                </Col>
                <Col xxl="2" xl="3" lg="3" md="4" sm="7" xs="9" className="pull-right">
                    <Link to='/opportunity-details'>
                        <Button>
                            Create Opportunity
                        </Button>
                    </Link>
                </Col>
            </Row>
            <DataTableBase enableExport
                columns={columns}
                data={opportunities}
                defaultSortFieldId="email_received_at"
                defaultSortAsc={false}
                onRowClicked={onRowClicked}
            />
        </Container>
    );
};

export default OpportunityList;
