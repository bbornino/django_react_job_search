import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiRequest } from '../useApiRequest';
import { JOB_POSTING_API_URL, formatDisplayDate } from "../constants";

import DataTableBase from './DataTableBase';
import {Container, Row, Col, Input, Button, InputGroup} from 'reactstrap';

const JobPostingList = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [filters, setFilters] = useState({
        filteredJobPostings: [],
        filterCompanyNameText: '',
        filterPostingTitleText: ''
    });
    const { apiRequest } = useApiRequest(); 
    const navigate = useNavigate();
    const hasFetched = useRef(false);  // Track if the request has already been made

    const getJobPostings = useCallback(async () => {
        if (hasFetched.current) return; // Prevent double fetch
        hasFetched.current = true;
        
        const data = await apiRequest(JOB_POSTING_API_URL, {method:'GET'});
        if(data) {
            setJobPostings(data);
            setFilters((prevState) => ({
                ...prevState,
                filteredJobPostings: data,
            }))
        } else {
            console.error('Failed to fetch job postings');
        }
    }, [apiRequest]);

    useEffect(() => {
        document.title = "Job Posting List - Job Search Tracker";
        getJobPostings();
    }, [getJobPostings]);

    const columns = [
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
            selector: row => row.applied_at,
            cell: row => formatDisplayDate(row.applied_at),
            sortable: true,
            width: "150px",
        },
        {
            name: "Rejected On",
            selector: row => row.rejected_at,
            cell: row => formatDisplayDate(row.rejected_at),
            sortable: true,
            width: "150px",
        },
    ];

    const onRowClicked = (row) => {
        navigate('/job-posting-edit/' + row.id);
    }

    const filterJobPostingsByParams = (companyName, postingTitle) => {
        const filteredItems = jobPostings.filter(item => 
            item.company_name && item.company_name.toLowerCase().includes(companyName.toLowerCase()) && 
            item.posting_title && item.posting_title.toLowerCase().includes(postingTitle.toLowerCase()))

            setFilters({ filterCompanyNameText: companyName, 
                        filterPostingTitleText: postingTitle,
                        filteredJobPostings: filteredItems})
    };

    const onCompanyNameFilter = e => {
        filterJobPostingsByParams(e.target.value, filters.filterPostingTitleText)
    }

    const onCompanyNameClear = () => {
        filterJobPostingsByParams('', filters.filterPostingTitleText)
    }

    const onPostingTitleFilter = e => {
        filterJobPostingsByParams(filters.filterCompanyNameText, e.target.value)
    }

    const onPostingTitleClear = () => {
        filterJobPostingsByParams(filters.filterCompanyNameText, '')
    }

    return (
        <Container>
            <Row className="m-4 align-items-center">
                <Col xl="4" sm="6" >
                    <h1>All Job Postings</h1>
                </Col>
                <Col xl="2" sm="6">
                    <Link to='/job-posting-new'>
                        <Button color="success" > Create Job Posting</Button>
                    </Link>
                </Col>
                <Col xl="3" lg="6" sm="6">
                    <InputGroup>
                        <Input  id="search" type="text" 
                                className="m-0"
                                placeholder="Filter by Company Name" 
                                aria-label="Search Input"
                                value={filters.filterCompanyNameText}
                                onChange={onCompanyNameFilter} />
                        <Button color="danger" onClick={onCompanyNameClear}  className="">X</Button>
                    </InputGroup>
                </Col>
                <Col xl="3" lg="6" sm="6">
                    <InputGroup>
                        <Input  id="search" type="text" 
                                className="m-0"
                                placeholder="Filter by Posting Title" 
                                aria-label="Search Input"
                                value={filters.filterPostingTitleText}
                                onChange={onPostingTitleFilter} />
                        <Button color="danger" onClick={onPostingTitleClear}  className="">X</Button>
                    </InputGroup>
                </Col>
            </Row>
            <DataTableBase  columns={columns}
                            data={filters.filteredJobPostings}
                            paginationPerPage={100}
                            onRowClicked={onRowClicked} />
        </Container>
    )

}

export default JobPostingList;