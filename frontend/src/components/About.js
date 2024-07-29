import React, { Component } from "react";

class About extends Component {
    render() {
        return (
            <div>
                <div class="container-fluid mt-10 p-t-10 text-center">
                    <h1>About this Application</h1>
                </div>

                <div class="container mt-5">
                    <div class="row">
                        <div class="col">
                            <p>The job hunt is exhausting.  And it can be difficult to keep track of all of the different sites that
                                you can find jobs on and all of the job listings that you have applied to.  Yes, the non-tech approach 
                                is to create a spreadsheet for that.  But you're now dealing with a normalized list which really lends 
                                itself well to writing an app for that!
                            </p>
                            <p>Some of the high level features of this application include:</p>
                            <ul>
                                <li>Feature A</li>
                                <li>Feature B</li>
                            </ul>
                            <p>
                            This application is built using the following technologies:
                            </p>
                            <ul>
                                <li>Front End: React.js Single Page Application (using Router)</li>
                                    <ul>
                                        <li>Bootstrap</li>
                                        <li>datatables</li>
                                    </ul>
                                <li>Python Django REST framework</li>
                                <li>Database: sqlite, which can easily be migrated to MySQL, MariaDB, AWS Aurora or the eventual goal, AWS DynamoDB. yes, I have discovered there is a hack for that. </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default About;