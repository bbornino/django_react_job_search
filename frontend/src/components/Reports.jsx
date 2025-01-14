import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { REPORT_API_URL } from "../constants";

import {Input, Button, Container, Row, Col, FormGroup} from 'reactstrap';
import DataTableBase from './DataTableBase';
import { useApiRequest } from "../useApiRequest";

// const isDate = (value) => {
//       // Check if the value is a string
//     if (typeof value !== 'string') return false;

//     // Regular expression to match date formats (YYYY-MM-DD or MM/DD/YYYY)
//     const dateRegex = /^(?:(?:\d{4}-\d{2}-\d{2})|(?:\d{1,2}\/\d{1,2}\/\d{4}))$/;

//     // Check if the value matches the date format
//     if (!dateRegex.test(value)) return false;

//     // Attempt to create a date from the value
//     const date = new Date(value);
    
//     // Check if the date is valid
//     return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
// };

const Reports = () => {
    const [startDate, setStartDate] = useState('');
    const [report, setReport] = useState({
        report_name: '',
        report_title: '',
        report_columns: [],
        report_data: [],
    });
    const navigate = useNavigate();
    const { apiRequest } = useApiRequest();

    const getReports = useCallback(async (reportName, reportDate) => {
        setStartDate(reportDate);

        const reportData = await apiRequest(REPORT_API_URL + reportName + '/' + reportDate, {method:'GET'});
        if (reportData) {
            var tableColumns = [];
            reportData.report_fields.forEach((fieldInfo) => {
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

            setReport({report_data: reportData.report_data, report_name: reportName,
                report_columns: tableColumns, report_title: reportData.report_name})
        }
    }, [apiRequest])


    const parseWindowLocationDate = (pathArr) => {
        var reportDate = '2024-01-01'       // Default Report Date when none set
        if (pathArr.length > 3) {
            const rDate = new Date(pathArr[3])
            if (!isNaN(rDate)) {
                reportDate = pathArr[3]
            }
        }
        return reportDate
    }

    useEffect(() => {
        const pathArr = window.location.pathname.split('/')
        if (pathArr.length > 2) {
            var reportName = pathArr[2]
            document.title = reportName + " Report - Job Search Tracker";
            var reportDate = parseWindowLocationDate(pathArr)
            getReports(reportName, reportDate);
        }
    }, [getReports])

    const onUpdateReport = e => {
        navigate('/reports/' + report.report_name + '/'+ startDate);
    }


    return (
        <Container>
            <Row className="m-4">
                <Col lg="9">
                    <h1>{report.report_title}</h1>
                </Col>
                <Col lg="2">
                    <FormGroup row>
                        <Input type="date"
                            id="start_date"
                            name="start_date"
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate ?? ''} />
                    </FormGroup>
                </Col>
                <Col lg="1">
                    <Button color="primary" className="m2"
                            onClick={onUpdateReport}>Update</Button>
                </Col>
            </Row>
            <DataTableBase  columns={report.report_columns}
                            data={report.report_data} />
        </Container>
    )

}

export default Reports;