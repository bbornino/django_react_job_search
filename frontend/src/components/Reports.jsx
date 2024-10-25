import {React, Component} from "react";
import axios from "axios";
import { REPORT_API_URL, formatInputFieldDateTime } from "../constants";

import {Input, Button, Container, Row, Col, FormGroup} from 'reactstrap';
import DataTableBase from './DataTableBase';

const isDate = (value) => {
      // Check if the value is a string
    if (typeof value !== 'string') return false;

    // Regular expression to match date formats (YYYY-MM-DD or MM/DD/YYYY)
    const dateRegex = /^(?:(?:\d{4}-\d{2}-\d{2})|(?:\d{1,2}\/\d{1,2}\/\d{4}))$/;

    // Check if the value matches the date format
    if (!dateRegex.test(value)) return false;

    // Attempt to create a date from the value
    const date = new Date(value);
    
    // Check if the date is valid
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
};

class Reports extends Component {

    state = {
        report_name: '',
        start_date: '',
        
        report_title: '',
        report_columns: [],
        report_data: [],
    }

    parseWindowLocationDate = (pathArr) => {
        console.log("Parsing window Date")
        var reportDate = '2024-01-01'       // Default Report Date when none set
        if (pathArr.length > 3) {
            const rDate = new Date(pathArr[3])
            if (!isNaN(rDate)) {
                reportDate = pathArr[3]
            }
        }
        return reportDate
    }

    componentDidMount() {
        const pathArr = window.location.pathname.split('/')
        if (pathArr.length > 2) {
            var reportName = pathArr[2]
            var reportDate = this.parseWindowLocationDate(pathArr)
            this.getReports(reportName, reportDate);
        }
    };

    getReports = (reportName, reportDate) => {
        console.log("get Reports")
        this.setState({report_name:reportName, start_date: reportDate});
        axios.get(REPORT_API_URL + reportName + '/' + reportDate).then( res => {
            var tableColumns = [];
            res.data.report_fields.forEach((fieldInfo) => {
                const fieldObj = {
                    name: fieldInfo.field_title,
                    selector: row => {
                        const value = row[fieldInfo.field_name];
                        // Check if the value is a date only
                        // return isDate(value) ? formatInputFieldDateTime(value) : value;
                        // Back end report now correctly formats the date
                        return value;
                      },
                    sortable: fieldInfo.sortable,
                    sortField: row => row[fieldInfo.field_name],
                }

                tableColumns.push(fieldObj)
            })

            this.setState({ report_data: res.data.report_data, 
                            report_columns: tableColumns, report_title: res.data.report_name})
        });
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    };

    onUpdateReport = e => {
        window.location = '/reports/' + this.state.report_name + '/'+ this.state.start_date
    }

    render() {
        return (
            <Container>
                <Row className="m-4">
                    <Col lg="9">
                        <h1>{this.state.report_title}</h1>
                    </Col>
                    <Col lg="2">
                        <FormGroup row>
                            <Input type="date"
                                id="start_date"
                                name="start_date"
                                onChange={this.onChange}
                                value={this.state.start_date ?? ''} />
                        </FormGroup>
                    </Col>
                    <Col lg="1">
                        <Button color="primary" className="m2"
                                onClick={this.onUpdateReport}>Update</Button>
                    </Col>
                </Row>
                <DataTableBase  columns={this.state.report_columns}
                                data={this.state.report_data} />
            </Container>
        )
    }
}

export default Reports;