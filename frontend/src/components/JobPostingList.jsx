import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_POSTING_API_URL, formatDisplayDate } from "../constants";

import DataTableBase from './DataTableBase';
import {Container, Row, Col, FormGroup, Input, Button, InputGroup} from 'reactstrap';

class JobPostingList extends Component {
    state = {
        jobPostings: [],
        filteredJobPostings: [],
        filterText: '',
        resetPaginationToggle: false,
    };

    componentDidMount() {
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
            cell: row => formatDisplayDate(row.applied_at),
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

    onFilter = e => {
        // debugger
        const filterValue = e.target.value
        const filteredItems = this.state.jobPostings.filter(
            item => item.company_name && item.company_name.toLowerCase().
                    includes(filterValue.toLowerCase()),
        );
        this.setState({filterText: filterValue, filteredJobPostings: filteredItems})
    }

    onClear = () => {
        debugger
        this.setState({filterText: '', filteredJobPostings: this.state.jobPostings})
    }

    render() {

        return (
            <Container>
                <Row className="m-4 align-items-center">
                    <Col md="6">
                        <h1>All Job Postings</h1>
                    </Col>
                    <Col lg="3" md="6">
                        <Link to='/job-posting-new'>
                            <Button color="success" > Create Job Posting</Button>
                        </Link>
                    </Col>
                    <Col lg="3" md="3">
                        <InputGroup>
                            <Input  id="search" type="text" 
                                    className="m-0"
                                    placeholder="Filter by Company Name" 
                                    aria-label="Search Input"
                                    value={this.state.filterText}
                                    onChange={this.onFilter} />
                            <Button color="danger" onClick={this.onClear}  className="">X</Button>
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