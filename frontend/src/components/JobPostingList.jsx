import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_POSTING_API_URL, formatDisplayDate } from "../constants";

import DataTableBase from './DataTableBase';
import {Container, Row, Col, Input, Button, InputGroup} from 'reactstrap';

class JobPostingList extends Component {
    state = {
        jobPostings: [],
        filteredJobPostings: [],
        filterCompanyNameText: '',
        filterPostingTitleText: '',
        resetPaginationToggle: false,
    };

    componentDidMount() {
        document.title = "Job Posting List - Job Search Tracker";
        this.resetState();
    };

    resetState = () => {
        this.getJobPostings();
    };

    getJobPostings = () => {
        axios.get(JOB_POSTING_API_URL).then(
            res => {

                this.setState({jobPostings:res.data, filteredJobPostings:res.data})
            });
    }

    columns = [
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

    onRowClicked = (row, event) => {
        window.location = '/job-posting-edit/' + row.id
    }

    onNewPostingClicked = (r, e) => {
        window.location = '/job-posting-new/'
    }

    filterJobPostingsByParams = (companyName, postingTitle) => {
        const filteredItems = this.state.jobPostings.filter(item => 
            item.company_name && item.company_name.toLowerCase().includes(companyName.toLowerCase()) && 
            item.posting_title && item.posting_title.toLowerCase().includes(postingTitle.toLowerCase()))

        this.setState({ filterCompanyNameText: companyName, 
                        filterPostingTitleText: postingTitle,
                        filteredJobPostings: filteredItems})
    };

    onCompanyNameFilter = e => {
        this.filterJobPostingsByParams(e.target.value, this.state.filterPostingTitleText)
    }

    onCompanyNameClear = () => {
        this.filterJobPostingsByParams('', this.state.filterPostingTitleText)
    }

    onPostingTitleFilter = e => {
        this.filterJobPostingsByParams(this.state.filterCompanyNameText, e.target.value)
    }

    onPostingTitleClear = () => {
        this.filterJobPostingsByParams(this.state.filterCompanyNameText, '')
    }

    render() {

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
                                    value={this.state.filterCompanyNameText}
                                    onChange={this.onCompanyNameFilter} />
                            <Button color="danger" onClick={this.onCompanyNameClear}  className="">X</Button>
                        </InputGroup>
                    </Col>
                    <Col xl="3" lg="6" sm="6">
                        <InputGroup>
                            <Input  id="search" type="text" 
                                    className="m-0"
                                    placeholder="Filter by Posting Title" 
                                    aria-label="Search Input"
                                    value={this.state.filterPostingTitleText}
                                    onChange={this.onPostingTitleFilter} />
                            <Button color="danger" onClick={this.onPostingTitleClear}  className="">X</Button>
                        </InputGroup>
                    </Col>
                </Row>
                <DataTableBase  columns={this.columns}
                                data={this.state.filteredJobPostings}
                                paginationPerPage={100}
                                onRowClicked={this.onRowClicked} />
            </Container>
        )
    }
}

export default JobPostingList;