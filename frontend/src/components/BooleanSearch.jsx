import React, { Component } from "react";
import {Container, Row, Col} from 'reactstrap';

class BooleanSearch extends Component {
    render() {
        return (
            <Container className="my-4 pb-5">
                <Row className="text-center mb-3">
                    <Col>
                        <h1>Using Boolean Logic to Find Job Opportunities</h1>
                    </Col>
                </Row>

                <Row>
                    <Col>

                        <h2>What is "boolean" and why should I use it?</h2>
<p>
Boolean logic is simply an “information retrieval technique that allows several search words and phrases to be combined using operators or commands.” Operators are instructions to the search engine such as “and,” “or,” “not,” and “near.” When we use these operators for keyword searches, it helps to narrow results!
</p><p>
Boolean is most commonly used by recruiters to narrow down candidates for the job they are trying to fill. However, jobseekers can use boolean strategies, too! It can be a great way to find roles that may not be listed or top of list on major job boards and allow for a more targeted search process.
</p><p>
Let’s learn the basics, and then we’ll teach you how you can strategically use boolean to curate your very own job board - unique to you!
</p>
<h2>Boolean Basics:</h2>
<p>
Use a the following commands to create a strong boolean search. Here is how to use each:
</p>
<ul>
<li>Using the command "AND" means that any search terms that follow an "AND" must appear in the search result. The "AND" function is represented by a space.

Example: Java Developer – will produce results with both Java and Developer
</li><li>
Using the command "OR" allows you to include several options in your search

Example: banking OR finance – will produce results that contain one or more of the stated words
</li><li>
Use quotation marks " " when you want to search for an exact phrase

Example: “Java Developer” – gives results that contain the phrase ‘java developer’
</li><li>
A clause within brackets ( ) is given priority over other elements in the search string. Commonly uses with OR search strings

Example: (“Java Developer” OR “J2EE Developer” OR “Java Programmer”) AND (san francisco jobs)
</li><li>
Using site: tells Google to search for keywords within a particular site

Example: site:www.linkedin.com java jobs san francisco
</li><li>
Put dates at the end of your boolean string to filter results by recency.

Example template: after:YYYY-MM-DD

Completed example: after:2024-06-24
</li><li>
At the end of your boolean string, use a hyphen followed by any word you wish to exclude from your search results.

Example: -Nonprofit
</li></ul>

<h2>Let’s Try It Out!</h2>

<ul>
    <li>
Step 1: Create a list of job titles/companies you want to search for

Example: (“Product Manager” OR “Senior Product Manager” OR “Product Marketing Manager” OR “Sr. Product Marketing Manager”) AND (Meta OR Apple OR Google OR Airbnb OR Amazon) AND (Seattle OR “San Francisco” OR “Menlo Park” OR Cupertino)
</li><li>
Step 2: Think of some websites that you would like to target where jobs might be posted. (Hint: We have a whole list for you at the end of this article!)

(site:metacareers.com OR site:careers.airbnb.com OR site:careers.google.com OR site:amazon.jobs OR site:jobs.apple.com)
</li><li>
Step 3: Open Google’s Search Engine, type in your search string, and hit search!
</li><li>
Step 4:*VERY IMPORTANT!!* We want to narrow your search, so remember to hit “Tools” and change “Any Time” to “Past Week” to ensure you’re receiving recent results!
</li></ul>
<p>
In addition to searching job sites directly, you can also search through applicant tracking systems (ATS) for opportunities, as many companies (including Spotify!) house their job applications on an ATS, such as Lever or Greenhouse. See below for a list of commonly-used ATSs!
</p>
<h2>Applicant Tracking Systems:</h2>

<ul><li>
site:jobs.lever.co
</li><li>
site:boards.greenhouse.io
</li><li>
site:myworkdayjobs.com
</li><li>
site:jobs.smartrecruiters.com
</li><li>
site:ICIMS.com
</li><li>
site:jobvite.com
</li><li>
site:workable.com
</li><li>
site:paylocity.com
</li></ul>

<h2>FAANG+ Companies:</h2>
<ul><li>
Apple: site:jobs.apple.com
</li><li>
Google: site:careers.google.com
</li><li>
Facebook/Meta: site:metacareers.com
</li><li>
Netflix: site:jobs.netflix.com
</li><li>
Spotify: site:lifeatspotify.com
</li><li>
Twitter: site:careers.twitter.com
</li><li>
Amazon: site:amazon.jobs
</li><li>
Microsoft: site:careers.microsoft.com
</li><li>
Tesla: site:tesla.com/careers
</li></ul>
<p>Here are some example boolean strings:</p>
<ul><li>
site:linkedin.com ("Ruby" AND (“programming” OR “code”)  “Arizona State University” "San Francisco"
</li><li>
site:linkedin.com ("college recruiter” OR “university recruiter” OR “technical recruiter”) AND (“data analyst” OR “data analysts”) AND “Hawaii” “[people you know]”
</li><li>
site:linkedin.com “Adobe XD" “[people you know]” “New York” “[past time (like volleyball)]”
</li><li>
Resumes:(intitle:resume OR intitle:cv) (filetype:pdf OR filetype:doc OR filetype:txt) “human resources” -job -jobs -sample -templates
</li><li>
site:linkedin.com "recruiter" "people you know" "we're hiring" "Florida” "marketing manager"
</li><li>
site:twitter.com (“college recruiter” OR “university recruiter” OR “technical recruiter”) “San Francisco”
</li><li>
site:linkedin.com bio "we're hiring" AND ("Austin" OR (“New York City” OR "NYC")) AND (blockchain) AND (cyber risk and threat analyst)
</li></ul>

Creative Boolean Strings:

Combine search sites (plug and chug your keywords and paste into Google URL):
(“Product manager” OR “product owner”) AND (“remote” OR “San Francisco”) AND (site:lever.co OR site:boards.greenhouse.io OR site:myworkdayjobs.com OR site:careers.Google.com OR site:Amazon.jobs OR site:metacareers.com OR site:jobs.Apple.com)

Have questions? Schedule an ad hoc with your Career Mentor for additional guidance. Best of luck in your job search!

Source: https://blog.stafflink.ca/job-search-tips/how-to-find-a-job-faster-with-boolean-logic

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default BooleanSearch;