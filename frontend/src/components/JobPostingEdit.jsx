import React, { Component} from "react";
import axios from "axios";
import { JOB_POSTING_API_URL, formatInputFieldDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"

class JobPostingEdit extends Component {
    state = {
        job_posting_id: 0,
        job_site_id_id: 0,
        posting_title: '',
        company_name: '',
        posting_status: '',

        posting_url_full: '',
        posting_url_domain: '',
        posting_password: '',

        pay_range: '',
        location_city: '',
        location_type: '',
        employment_type: '',

        applied_at: '',
        interviewed_at: '',
        rejected_at: '',
        rejected_after_stage: '',

        job_scan_info: '',
        outreach_info: '',
        
        technology_string: '',
        technology_stack: [],
        comments: [],
        posting_application_questions: [],
        job_description: 'TBD',
    }

    getJobPosting = (job_posting_id) => {
        console.log("getJobPosting")
        debugger
        // const {posting_id, location} = this.props;
    }

    componentDidMount() {
        console.log("Starting Mount")
        debugger
    };

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    };

    onEditorChange = e => {
        const collection = document.getElementsByClassName("ck-content")
        if (collection.length === 1) {
            const newVal = collection[0].ckeditorInstance.getData()
            this.setState({description: newVal})
        }
    };

    onDeleteJobPosting = e => {
        console.log("Deleting Job Posting")
        axios.delete(JOB_POSTING_API_URL + this.state.job_posting_id,
                    this.state).then(() => {
            window.location = '/job-posting-view'
        })
    }

    createJobPosting = e => {
        e.preventDefault();
        axios.post(JOB_POSTING_API_URL, this.state).then(() => {
            window.location = '/job-posting-view/' + this.state.job_posting_id
        })
    }

    editJobPosting = e => {
        e.preventDefault();
        axios.put(JOB_POSTING_API_URL + this.state.job_posting_id,
            this.state).then(() => {
                window.location = '/job-posting-view/' + this.state.job_posting_id
            })
    }

    render() {
        const {jobPostings} = this.state;
        return (
            <Container>
                Job Posting EDIT
            </Container>
        )
    }
}

export default JobPostingEdit;