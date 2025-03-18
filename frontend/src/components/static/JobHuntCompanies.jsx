import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class JobHuntCompanies extends Component {
    componentDidMount() {
        document.title = "Companies to Check Out - Job Search Tracker";
    }

    render() {
        return (
            <Container className="mt-4 p-t-10">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>PHP Companies</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>There are still some companies that use PHP pretty extensively:</p>
                        <ul>
                            <li className="my-2"><a href="https://edd.ca.gov/">Meta (formerly Facebook)</a>
                                <ul>
                                    <li>Technologies: JavaScript (React, Node.js), PHP (originally built on PHP with a custom variant called Hack), MySQL.</li>
                                    <li>Opportunities: Meta still maintains some PHP-based systems and has roles requiring knowledge of PHP, JavaScript, and databases like MySQL.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">Shopify</a>
                                <ul>
                                    <li>Technologies: JavaScript (React), PHP (the core of Shopify's platform), MySQL.</li>
                                    <li>Opportunities: Shopify is built on PHP and MySQL, making it a great fit for developers with your skillset.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">Automattic (WordPress)</a>
                                <ul>
                                    <li>Technologies: PHP (WordPress is built on PHP), JavaScript (React, Node.js), MySQL.</li>
                                    <li>Opportunities: Automattic is a major user of PHP, given WordPress's reliance on it. MySQL is also a core component of their stack, along with JavaScript for front-end work.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">Square (Block, Inc.)</a>
                                <ul>
                                    <li>Technologies: JavaScript (React, Node.js), PHP (for legacy systems), MySQL.</li>
                                    <li>Opportunities: Square still maintains some systems that use PHP, especially in conjunction with JavaScript and MySQL for payment and e-commerce platforms.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">Slack (Salesforce)</a>
                                <ul>
                                    <li>Technologies: JavaScript (React, Node.js), PHP (for some parts of the backend), MySQL.</li>
                                    <li>Opportunities: Slack uses PHP in parts of its backend alongside JavaScript for real-time collaboration services.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">eBay</a>
                                <ul>
                                    <li>Technologies: JavaScript (Node.js, React), PHP (used for legacy systems), MySQL.</li>
                                    <li>Opportunities: eBay has a significant PHP legacy codebase and is a great option for PHP developers who also have experience with JavaScript and MySQL.</li>
                                </ul>
                            </li>
                            <li className="my-2"><a href="https://edd.ca.gov/">GitHub (Microsoft)</a>
                                <ul>
                                    <li>Technologies: JavaScript (React), PHP, MySQL.</li>
                                    <li>Opportunities: GitHub uses PHP for parts of their platform and relies on JavaScript for front-end development, making your skills valuable.</li>
                                </ul>
                            </li>
                        </ul>

                    </Col>
                </Row>


                <Row className="text-center mb-3">
                    <Col>
                        <h1>Staffing Agencies</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>There are many staffing agencies out there.  Here are some of the ones with a better reputation:</p>
                        <ul>
                            <li className="my-2"><a href="https://edd.ca.gov/">Randstad</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Robert Half</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">TEK Systems</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Kelly Mitchell</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Insight Global</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Toptal</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Akkodis</a></li>
                        </ul>

                        <p>Here are a few others that I've put my profile on:</p>
                        <ul>
                            <li className="my-2"><a href="https://edd.ca.gov/">Cyber Coders</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Robert Half</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">TEK Systems</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Kelly Mitchell</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Insight Global</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Toptal</a></li>
                            <li className="my-2"><a href="https://benefitscal.com/">Akkodis</a></li>
                        </ul>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>Also check out a site created by somebody on <a href="https://www.reddit.com/r/leetcode/comments/1j3dsmn/i_built_a_faang_job_board_only_jobs_scraped_in/" 
                        >r/LeetCode</a>: <a href="https://topjobstoday.com"></a>Top Jobs Today</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default JobHuntCompanies;