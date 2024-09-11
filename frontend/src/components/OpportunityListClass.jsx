import {React, useForm, Component, setState} from "react";
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";

import DataTable from './DataTableBase';
import {Button, Container, Row, Col, Form, Card} from 'reactstrap';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import Card from 'react-bootstrap/Card';

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

    onRowClicked = (row, event) => { 
        console.log("I clicked a row")
        // window.location = route('opportunities.edit', row)
    };

    render() {
        return (
            <div>
                <h1>A list of opportunities!</h1>
                <Container className="mt-2">
                <Row className="m-4">
                    A bunch of recruiters think its okay to spam me  just because I have my profile up.  Even when I remove myself from their list, they add me back on!
                </Row>
                
                <Card>
                    <Card.Header>Create Opportunity</Card.Header>
                    <Form onSubmit={submit}>
                        <Row className="m-2">
                            <Col xl="3" lg="6">
                                <Form.Group controlId="opportunityRecruiterName">
                                    <Form.Label>Recruiter Name</Form.Label>
                                    <Form.Control type="text" required 
                                        value={data.recruiter_name}
                                        onChange={e => setData('recruiter_name', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="opportunityJobTitle">
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control type="text" required 
                                        value={data.job_title}
                                        onChange={e => setData('job_title', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl="3" lg="6" className="m-2">
                                <Form.Group className="mb-3" controlId="opportunityEmailRecieved">
                                    <Form.Label>Email Received Date</Form.Label>
                                    <Form.Control type="datetime-local" required 
                                        value={data.email_received_at}
                                        onChange={e => setData('email_received_at', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className="d-flex align-items-center justify-content-center">
                                <Button variant="primary" type="submit" className="d-flex align-items-center " >Save Opportunity</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <h1 className="mt-3">All Opportunities</h1>
                
                <DataTable columns={columns} data={opportunities} onRowClicked={onRowClicked} />
            </Container>
            </div>
            
        )
    }
}

export default OpportunityList;