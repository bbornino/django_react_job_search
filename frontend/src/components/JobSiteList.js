import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_SITE_API_URL } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';

class JobSiteList extends Component {
    state = {
        jobSites: [],
    };

    componentDidMout() {
        this.resetState();
    };

    resetState = () => {
        this.getJobSites();
    };

    getJobSites = () => {
        axios.get(JOB_SITE_API_URL).then(
            res => this.setState({jobSites:res.data}));
    };

    columns = [
        {
            name: 'Site Name',
            selector: row => row.site_name,
            sortable: true,
        },
        {
            name: 'Site URL',
            selector: row => row.site_url,
            sortable: true,
        },
        {
            name: 'Rating',
            selector: row => row.rating,
            sortable: true,
        },
        {
            name: 'Headline',
            selector: row => row.headline,
            sortable: true,
        },
        {
            name: 'Site Last Visited',
            selector: row => row.last_visted_at,
            sortable: true,
        },
    ];

    onRowClicked = (row, event) => {
        window.location = '/job-site-details/' + row.id
    };

    render() {
        const { jobSites } = this.state;
        return (
            <Container className="mt-2">
                <Row className="m-4">
                    <Col xxl="10" xl="9" lg="9" md="8" sm="5" xs="3">
                        <h1>All Job Sites</h1>
                    </Col>
                    <Col>
                        <Link to='/job-site-details'>
                            <Button> Create Job Site</Button>
                        </Link>
                    </Col>
                </Row>
                <DataTableBase  columns={this.columns}
                                data={jobSites}
                                onRowClicked={this.onRowClicked} />
            </Container>
        )
    }
}

export default JobSiteList;