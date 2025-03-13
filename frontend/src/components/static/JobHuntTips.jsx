import React, { Component } from "react";
import {Container, Row, Col, List} from 'reactstrap';

class JobHuntTips extends Component {
    componentDidMount() {
        document.title = "Job Hunt Tips - Job Search Tracker";
    }

    render() {
        return (
            <Container className="mt-4 mb-5 p-t-10">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>Job Hunting Tips!</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h2>Preparing for the Hunt</h2>
                        <List type="unstyled" >
                            <li className="check"> Resume Writer: Only have one written by a professional who &nbsp;
                            <em>specializes in Software Engineering </em>resumes.  Read multiple reviews on the writer!</li>
                            <li className="check">If that doesn't work: use <a href="pathrise.com">Pathrise</a>.  
                                &nbsp;<strong><em>WARNING:</em></strong> tread lightly with that organization. At the end of the day, Pathrise
                                is a business looking to make money off of you no matter what.  They have no problems making false promises, 
                                promising you to get you a job, just to do nothing.  Unless you are a slam dunk for them I would suggest avoding them...</li>
                            <li className="check"> Social Networking.  Companies review your posts and network.  Is there anybody on Facebook 
                                or LinkedIn you'd rather them not see?</li>
                            <li className="check"> Its always best to look for work when you alrady have a job.  It may be a slower search, but
                                you're able to say no to lower pay.  Plus, the stress level of having no income while searching is <em>debilitating</em>!
                            </li>
                            <li className="check">Participate in open source projects.  
                                Create your own project website and share the url and open up the repository on GitHub.</li>
                        </List>
                        <br/>
                        <h2>Checking out Individual Job Postings</h2>
                        <List type="unstyled" >
                            
                            <li className="check"><a href="https://app.jobscan.co/">Job Scan</a>.  My numbers are preliminary, but I believe that 
                                Job Scan helps cut through ATS.  I went from roughly a 1.7% Job Application response rate to maybe 2.5% or higher.
                                I purchased the Quarterly plan which at this time costs about $90 per month.</li>
                            <li className="check">Apparently, most job candidates are hired from the first 2-3 days of the job being possted.
                                I've been told that applying for jobs upwards of a week out is fine.  However, applying for job postings that have
                                been posted for over 2 weeks is a waste of time.
                            </li>
                            <li className="check">Outreach - Contacting people at the companies is probably a good idea.  I've been told that 
                                maybe 1% of job applicants also reach out to people who work at the company.  I tried that for over 150 applications
                                yet got no measurable difference in application response.</li>                            
                            <li className="check"> Health Benefits?  Some jobs don't offer them.  ObamaCare might cover some of the cost.  
                                However, those plans are terrible!  Either stick with larger companies or negotiate a higher
                                salary with smaller companies to compensate for the high cost of premiums, deductables, and copays!</li>
                            <li className="check"> What is the Pay Range?  In the State of California, the 
                                <a href="https://californiapayroll.com/blog/sb-1162-california-pay-transparency-law/"> Pay Transparency Law</a> 
                                &nbsp;states that all 
                                &nbsp;<a href="https://calmatters.org/economy/2022/12/california-pay-transparency-law/">employers are required by law</a>
                                &nbsp;to fully disclose the pay range.  In 2023, some employers were offering a pay range of... $25 to $35 an hour!
                                Others in the $100k to $130k, and still others $150k to $215k...</li>
                            <li className="check"> Skills Growth. What new skills will you be learning?  And, where are those skills located on the 
                                &nbsp;<a href="https://www.tiobe.com/tiobe-index/">TIOBE Index</a>?  Is there a future for those skills?  </li>
                        </List>
                        <br/>
                        <h2>Checking out the Company</h2>
                        <List type="unstyled" >
                            <li className="check"> Employee Reviews.  Check out the company standing on <a href="glassdoor.com">Glassdoor</a> 
                            &nbsp;and other sites!  Don't be stuck in a terrible corporate environment.</li>
                            <li className="check"> Work-Life Balance.  Do they allow to work from home?  Flexible Hours?  
                                Can longer breaks be taken to run errands, doctor's visits, walks, and bike rides?</li>
                            <li className="check"> Read their Diversity, Equity, and Inclusion Statement.  Be extra wary of businesses
                                located in unfriendly states!</li>
                            <li className="check"> Does the company allow for gig work on the side (to offset lower pay?)?</li>
                        </List>
                    </Col>
                </Row>

                <Row className="text-center mb-5 pb-5">
                    <Col>
                        <strong><em>Good Luck!</em></strong>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default JobHuntTips;