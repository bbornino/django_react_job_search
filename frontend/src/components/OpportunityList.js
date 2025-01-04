import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiRequest } from '../useApiRequest';
import { JOB_OPPORTUNITY_API_URL, formatDisplayDateTime } from "../constants";

import DataTableBase from './DataTableBase';
import { Button, Container, Row, Col } from 'reactstrap';

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const { apiRequest } = useApiRequest(); 
    const navigate = useNavigate();

    // Memoize the getOpportunities function to avoid re-renders due to function change
    const getOpportunities = useCallback(async () => {
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
            name: 'Recruiter Name',
            selector: row => String(row.recruiter_name),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.opportunity_status,
            sortable: true,
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
        <Container className="mt-2">
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
            <DataTableBase 
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
