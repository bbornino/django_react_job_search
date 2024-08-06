import {React, useForm, Component, setState} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";

import DataTable from './DataTableBase';
import {Button, Container, Row, Col, Form, Card} from 'reactstrap';

class OpportunityList extends Component {
    state = {
        opportunities: [],
        recruiter_name: '',
        job_title: '',
        opportunity_status: '4 - No Response',
        recruiter_company: '',
        job_description: '',
    };

    componentDidMount() {
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
            name: 'Job Title',
            selector: row => row.job_title,
        },
        {
            name: 'Recruiter Name',
            selector: row => row.recruiter_name,
        },
        {
            name: 'Status',
            selector: row => row.opportunity_status,
        },
    ];

    submit = (e) => {
        e.preventDefault();
        console.log("I might submit")
        // post(route('opportunities.store'));

    };

    onRowClicked = (row, event) => { 
        window.location = '/opportunity-details/' + row.id
    };


    render() {
        const { opportunities } = this.state;
        return (
            <div>
                <Container className="mt-2">
                <Row className="m-4">
                    A bunch of recruiters think its okay to spam me just because I have my profile up.  Even when I remove myself from their list, they add me back on!
                    <Link to='/opportunity-details'>
                        <Button>
                            Create Opportunity
                        </Button>
                    </Link>
                </Row>

                <h1 className="mt-3">All Opportunities</h1>
                
                <DataTable columns={this.columns} data={opportunities} onRowClicked={this.onRowClicked} />
            </Container>
            </div>
            
        )
    }
}

export default OpportunityList;