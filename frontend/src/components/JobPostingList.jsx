import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_POSTING_API_URL, formatDisplayDate } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';

class JobPostingList extends Component {
    state = {
        jobPostings: [],
    };

    componentDidMount() {
        this.resetState();
    };

    resetState = () => {
        this.getJobPostings();
    };

    getJobPostings = () => {
        axios.get(JOB_POSTING_API_URL).then(
            res => this.setState({jobPostings:res.data}));
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
            selector: row => formatDisplayDate(row.applied_at),
            sortable: true,
            sortField: 'applied_at'
        },
        {
            name: "Rejected On",
            selector: row => formatDisplayDate(row.rejected_at),
            sortable: true,
            sortField: 'rejected_at'
        },
    ];

    onRowClicked = (row, event) => {
        window.location = '/job-posting-edit/' + row.id
    }

    onNewPostingClicked = (r, e) => {
        window.location = '/job-posting-new/'
    }

    render() {
        const {jobPostings} = this.state;
        return (
            <Container>
                <Row className="m-4">
                    <Col xxl="10" xl="9" lg="9" md="8" sm="5" xs="3">
                        <h1>All Job Postings</h1>
                    </Col>
                    <Col>
                        <Link to='/job-posting-new'>
                            <Button> Create Job Posting</Button>
                        </Link>
                    </Col>
                </Row>
                <DataTableBase  columns={this.columns}
                                data={jobPostings}
                                onRowClicked={this.onRowClicked} />
            </Container>
        )
    }
}

export default JobPostingList;