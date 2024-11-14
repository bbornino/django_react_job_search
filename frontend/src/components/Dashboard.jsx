import {React, Component} from "react";
import axios from "axios";
import { DASHBOARD_API_URL, JOB_POSTING_API_URL, JOB_OPPORTUNITY_API_URL, formatDisplayDate } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';

class Dashboard extends Component {
    state = {
        activeJobPostings: [],
        activeOpportunities: [],
        statisticsBlock: '',
    }
    
    componentDidMount() {
        document.title = "Dashboard - Job Search Tracker";
        this.getJobHuntStatistics();
        this.getActiveJobPostings();
        this.getActiveOpportunities();
    }

    getJobHuntStatistics = () => {
        axios.get(DASHBOARD_API_URL).then( res => {
            console.log("Job Hunt Statistics:")
            console.log(res.data)
            if(res.data === '') {
                console.log("TODO: write dashboard serializer")
            }

            var statisticsBlock = res.data.map((statistics_row) => (
                <Row className="my-1" key={statistics_row.formatted_date}>
                    <Col>{statistics_row.formatted_date}</Col>
                    <Col>{statistics_row.total_count}</Col>
                    <Col>{statistics_row.response_count}</Col>
                    <Col>{(100*statistics_row.response_count / statistics_row.total_count).toFixed(1)}%</Col>
                </Row>
            ));

            this.setState({statisticsBlock: statisticsBlock})
        });
    };

    getActiveJobPostings = () => {
        axios.get(JOB_POSTING_API_URL + 'active').then( res => {
            if (res.status == 200) {
                this.setState({activeJobPostings: res.data})
            }
        });
    };

    onActiveJobPostingRowClicked = (row, event) => {
        window.location = '/job-posting-edit/' + row.id
    }

    jobPostingListColumns = [
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
            id: 'posting_status',
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
            id: 'applied_at',
            selector: row => row.applied_at,
            cell: row => formatDisplayDate(row.applied_at),
            sortable: true,
            width: "150px",
        },
    ];

    getActiveOpportunities = () => {
        axios.get(JOB_OPPORTUNITY_API_URL + 'active').then( res => {
            if (res.status == 200) {
                this.setState({activeOpportunities: res.data})
            }
        });
    };

    onActiveOpportunityRowClicked = (row, event) => {
        window.location = '/opportunity-details/' + row.id
    }

    opportunityListColumns = [
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
            cell: row => formatDisplayDate(row.email_received_at),
            sortable: true,
            id:'email_received_at',
            width: "250px",
        },
    ];

    render() {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return(
            <Container className="mt-2">
                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Job Hunt Statistics</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        <p>Data as of {currentDate}</p>
                        <Row>
                            <Col></Col>
                            <Col>Postings Applied </Col>
                            <Col>Responses</Col>
                            <Col>Response Rate</Col>
                        </Row>
                        {this.state.statisticsBlock}
                        {/* <Row>
                            <Col>March 1, 2024</Col>
                            <Col>933</Col>
                            <Col>17</Col>
                            <Col>1.8%</Col>
                        </Row>
                        <Row>
                            <Col>June 25, 2024</Col>
                            <Col>237</Col>
                            <Col>5</Col>
                            <Col>2.1%</Col>
                        </Row> */}
                    </CardBody>
                </Card>

                <Card id="active_postings" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Job Postings</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        <DataTableBase  columns={this.jobPostingListColumns}
                                data={this.state.activeJobPostings}
                                paginationPerPage={20}
                                defaultSortFieldId="applied_at"
                                noDataComponent="No Active Job Postings"
                                defaultSortAsc={true}
                                onRowClicked={this.onActiveJobPostingRowClicked} />
                    </CardBody>
                </Card>
                <Card id="active_opportunities" className="text-dark bg-light m-3">
                    <CardTitle className="mx-4 my-2">
                        <strong>Active Opportunities</strong>
                    </CardTitle>
                    <CardBody className="bg-white">
                        <DataTableBase  columns={this.opportunityListColumns}
                                data={this.state.activeOpportunities}
                                paginationPerPage={20}
                                defaultSortFieldId="posting_status"
                                noDataComponent="No Active Opportunities"
                                defaultSortAsc={true}
                                onRowClicked={this.onActiveOpportunityRowClicked} />
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default Dashboard;