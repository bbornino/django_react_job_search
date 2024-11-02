import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class FinancialAssistance extends Component {
    render() {
        return (
            <Container className="mt-4 p-t-10">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>Northern California Financial Assistance Programs</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <p>There are quite a few services that, when I first lost my job, I did not know about.  Here are the ones that I have stumbled upon:</p>
                        <ul>
                            <li className="my-2"><a href="https://edd.ca.gov/">CA EDD Unemployment</a> - do this right away.  A certain dollar amount 
                                will be set for you for "a year".  
                                That year will be 1 year from the date that you filed.  So if you filed September 2023, it will end
                                September 2024. That Once that dollar ammount is exhausted: that's it, there will be no more 
                                unemployment benefits until the end of the year when you will have to completely re-enroll. </li>
                            <li className="my-2"><a href="https://www.coveredca.com/">Covered California</a> - Be careful!  COBRA would have been 
                                cheaper for me!  Some COBRA plans are really cheap (a few hundred dollars) or even free!  
                                Other plans may cost $900.  My doctor, in the 
                                largest regional medical group in the Sacramento Metropolitan area, was not covered by the cheapest 
                                Covered California plan.  Moving onto Covered California changed all of my out of pocket expense 
                                balances back to zero.  However, once you do start, always keep them updated on your income.  
                                The balances did not change for me as my income changed (which actually changed my plan), 
                                yet the premium reduced!  In fact, 
                                for a very low income year (below $30k), the expensive Covered California plan was subsidized 100%!</li>
                            <li className="my-2"><a href="https://benefitscal.com/">Food Stamps</a> - EDD maxes out at $450 per week.  This is enough
                                "income" for food stamps to almost not be worth it.  That came out to $23 per month!  But, when UI 
                                goes away, get on it!  It was close to $300 a month!  This covers WinCo and Trader Joes...</li>
                            <li className="my-2"><a href="https://www.smud.org/Rate-Information/Low-income-and-nonprofits">Electric Bill</a> - Utility 
                                Companies may offer Low Income programs. I have SMUD.org.  Others nearby have PG&E.  SMUD has 
                                a "Energy Assistance Program Rate" which is for low income people.  I'm not quite sure what income 
                                they have me at right now, but...  My last bill suggested maybe a 50% drop.  Going back on to 
                                Unemployment, I'll leave it be as unemployment doesn't even cover the mortgage, let alone... 
                                utilities or food to eat.</li>
                        </ul>

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default FinancialAssistance;