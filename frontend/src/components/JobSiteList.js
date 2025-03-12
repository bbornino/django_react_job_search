import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiRequest } from '../utils/useApiRequest';
import { JOB_SITE_API_URL, formatDisplayDate  } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';

const JobSiteList = () => {
    const [jobSites, setJobSites] = useState([]);
    const { apiRequest } = useApiRequest(); 
    const navigate = useNavigate();
    const hasFetched = useRef(false);  // Track if the request has already been made

    // Memoize the getOpportunities function to avoid re-renders due to function change
    const getJobSites = useCallback(async () => {
        if (hasFetched.current) return; // Prevent double fetch
        hasFetched.current = true;
        
        const data = await apiRequest(JOB_SITE_API_URL, {method: 'GET'});
        if (data) {
            setJobSites(data);
        } else {
            console.error('Failed to fetch job sites');
        }
    }, [apiRequest] );      // apiRequest is a dependancy

    useEffect(() => {
        document.title = "Job Site List - Job Search Tracker";
        getJobSites(); // Call the memoized getOpportunities function
    }, [getJobSites]);
    


    const columns = [
        {
            name: 'Site Name',
            selector: row => row.site_name,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Site URL',
            selector: row => row.site_url,
            sortable: true,
            width: "300px",
        },
        {
            name: 'Rating',
            selector: row => row.rating,
            sortable: true,
            id: 'rating',
            width: "90px" 
        },
        {
            name: "Site Last Visited",
            selector: row => row.last_visited_at,
            sortable: true,
            cell: row => formatDisplayDate(row.last_visited_at),
            width: "150px",
            id: 'last_visited_at',
        },
        {
            name: 'Headline',
            selector: row => row.headline,
            wrap: true,
        },
        
    ];

    const onRowClicked = (row, event) => {
        navigate('/job-site-view/' + row.id);
    };


    return (
        <Container className="mt-2">
            <Row className="m-4">
                <Col xxl="10" xl="9" lg="9" md="8" sm="5" xs="3">
                    <h1>All Job Sites</h1>
                </Col>
                <Col>
                    <Link to='/job-site-edit'>
                        <Button color="success" > Create Job Site</Button>
                    </Link>
                </Col>
            </Row>
            <DataTableBase  columns={columns}
                            data={jobSites}
                            defaultSortFieldId="rating"
                            onRowClicked={onRowClicked} />
        </Container>
    )

}

export default JobSiteList;