import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL, formatDisplayDateTime } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';

class OpportunityList extends Component {
    state = {
        opportunities: [],
    };

    componentDidMount() {
        document.title = "Opportunity List - Job Search Tracker";
        this.resetState();
    }

    resetState = () => {
        this.getOpportunities();
    };
    
    getOpportunities = () => {
        axios.get(JOB_OPPORTUNITY_API_URL).then(res => this.setState({ opportunities: res.data }));
    };

    columns = [
        {
            name: 'Title',
            selector: row => row.job_title,
            sortable: true,
        },
        {
            name: 'Recruiter Name',
            selector: row => String(row.recruiter_name),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.opportunity_status,
            sortable: true,
        },
        {
            name: "Received At",
            selector: row => row.email_received_at,
            cell: row => formatDisplayDateTime(row.email_received_at),
            sortable: true,
            id:'email_received_at',
            width: "250px",
        },
    ];

    onRowClicked = (row, event) => { 
        window.location = '/opportunity-details/' + row.id
    };


    render() {
        const { opportunities } = this.state;
        return (
            <Container className="mt-2">
                <Row className="m-4">
                    <Col xxl="10" xl="9" lg="9" md="8" sm="5" xs="3">
                        <h1>All Opportunities</h1>
                    </Col>
                    <Col xxl="2" xl="3" lg="3" md="4" sm="7" xs="9" className="pull-right">
                        <Link to='/opportunity-details'>
                            <Button>
                                Create Opportunity
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <DataTableBase  columns={this.columns} data={opportunities} 
                                defaultSortFieldId="email_received_at"
                                defaultSortAsc={false}
                                onRowClicked={this.onRowClicked} />
            </Container>
        )
    }
}

export default OpportunityList;