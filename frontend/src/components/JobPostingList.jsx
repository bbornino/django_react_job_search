import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_SITE_API_URL } from "../constants";

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
            selector: row => row.company_name,
            sortable: true,
        },
        {
            name: "Applied On",
            selector: row => row.company_name,
            sortable: true,
        },
        {
            name: "Rejected On",
            selector: row => row.company_name,
            sortable: true,
        },
    ];

    onRowClicked = (row, event) => {
        window.location = '/job-postings/'
    }

    render() {
        const {jobPostings} = this.state;
        return (
            <Container>
                Job Postings List
            </Container>
        )
    }
}

export default JobPostingList;