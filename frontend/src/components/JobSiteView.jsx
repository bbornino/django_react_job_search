import React, { Component} from "react";
import axios from "axios";
import { JOB_SITE_API_URL, formatDisplayDateTime } from "../constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class JobSiteView extends Component {
    state = {
        job_site_id: 0,
        description: '',
        headline: '',
        last_visited_at: '',
        rating: '',
        resume_updated_at: '',
        site_name: '',
        site_url: '',
    };

    componentDidMount() {
        const pathArr = window.location.pathname.split('/')
        if (pathArr[2] !== undefined) {
            const jobSiteId = pathArr[2]
            this.setState({job_site_id: pathArr[2]})
            this.getJobSite(jobSiteId)
        }
    };


    getJobSite = (jobSiteId) => {
        console.log("getJobSite received " + jobSiteId);
        axios.get(JOB_SITE_API_URL + jobSiteId).then(res => {
            debugger;
            console.log("Processing")
            console.log(res)
            
            this.setState({
                job_site_id: res.data.id,
                site_name: res.data.site_name,
                site_url: res.data.site_url,
                rating: res.data.rating,
                last_visited_at: formatDisplayDateTime(res.data.last_visited_at),
                resume_updated_at: formatDisplayDateTime(res.data.resume_updated_at),
                headline: res.data.headline,
                description: res.data.description,
            })

        })
    }


    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        Hello World today
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default JobSiteView;
