import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_SITE_API_URL, formatDisplayDate  } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';

class JobSiteList extends Component {

    state = {
        jobSites: [],
    };

    componentDidMount() {
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
            maxWidth: "200px",
        },
        {
            name: 'Site URL',
            selector: row => row.site_url,
            sortable: true,
            maxWidth: "300px",
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
            selector: row => formatDisplayDate(row.last_visited_at),
            sortable: true,
            sortField: 'last_visited_at',
            maxWidth: "150px",
            id: 'last_visited_at',
        },
        {
            name: 'Headline',
            selector: row => row.headline,
            grow: 2,
            maxWidth: "400px",
            wrap: true,
        },
        
    ];

    onRowClicked = (row, event) => {
        window.location = '/job-site-view/' + row.id
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
                        <Link to='/job-site-edit'>
                            <Button color="success" > Create Job Site</Button>
                        </Link>
                    </Col>
                </Row>
                <DataTableBase  columns={this.columns}
                                data={jobSites}
                                defaultSortFieldId="rating"
                                onRowClicked={this.onRowClicked} />
            </Container>
        )
    }
}

export default JobSiteList;