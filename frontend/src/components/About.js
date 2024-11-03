import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class About extends Component {
    componentDidMount() {
        document.title = "About - Job Search Tracker";
    }

    render() {
        return (
            <Container className="mt-4 p-t-10">
                <Row className="mb-3 text-center">
                    <h1>About this Application</h1>
                </Row>

                <Row>
                    <Col>
                        <p>The job hunt is exhausting.  And it can be difficult to keep track of all of the different sites that
                            you can find jobs on and all of the job listings that you have applied to.  Yes, the non-tech approach 
                            is to create a spreadsheet for that.  But when you have job sites which contain postings which you may 
                            have none to multiple comments...  you are then using normalized data which really lends 
                            itself well to writing an app for that!
                        </p>
                        <p>Some of the high level features of this application include:</p>
                        <ul>
                            <li>Comments - Create, Read, Edit, and Delete</li>
                            <li>Job Opportunity WYSIWYG Editor (CKEditor5)</li>
                        </ul>
                        <p>
                        This application is built using the following technologies:
                        </p>
                        <ul>
                            <li>Front End: React.js Single Page Application (using Router)</li>
                                <ul>
                                    <li>Bootstrap (using react-strap)</li>
                                    <li>react-data-table-component</li>
                                    <li>CK Editor 5</li>
                                    <li>Font Awesome</li>
                                </ul>
                            <li>Python Django REST framework</li>
                            <li>Database: sqlite, which can easily be migrated to MariaDB or AWS Aurora.  The eventual goal is to 
                                migrate to MongoDB then AWS DynamoDB. I have discovered there is a hack for that... </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default About;