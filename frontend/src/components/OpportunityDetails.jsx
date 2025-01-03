import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { JOB_OPPORTUNITY_API_URL, formatInputFieldDateTime } from "../constants";
import { Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import Editor from "./Editor";
import Comments from "./Comments";
import { useApiRequest } from "../useApiRequest";

const OpportunityDetails = () => {
  const [state, setState] = useState({
    opportunity_id: 0,
    job_title: "",
    opportunity_status: "6 - Opportunity Ignored",
    recruiter_name: "",
    recruiter_company: "",
    email_received_at: "",
    employment_type: "",
    job_duration: "",
    location_type: "",
    location_city: "",
    comments: [],
    job_description: "",
  });

  const { apiRequest: deleteOpportunity } = useApiRequest();
  const { apiRequest } = useApiRequest();
  const navigate = useNavigate();

  // Load opportunity data based on opportunity_id
  const loadOpportunity = useCallback(async (opportunity_id) => {
    if (!opportunity_id) return;

    const data = await apiRequest(
      JOB_OPPORTUNITY_API_URL + opportunity_id,
      { method: 'GET' }
    );
    console.log(data);

    if (data) {
      setState((prevState) => ({
        ...prevState,
        job_title: data.job_title,
        opportunity_status: data.opportunity_status,
        recruiter_name: data.recruiter_name,
        recruiter_company: data.recruiter_company,
        email_received_at: formatInputFieldDateTime(data.email_received_at),
        employment_type: data.employment_type,
        job_duration: data.job_duration,
        location_type: data.location_type,
        location_city: data.location_city,
        comments: data.comments,
        job_description: data.job_description,
      }));

      // Avoid race conditions by waiting before interacting with the CKEditor instance
      setTimeout(() => {
        const descCard = document.getElementById("description_card_body");
        const ckeContent = descCard?.querySelector(".ck-content");
        if (ckeContent) ckeContent.ckeditorInstance.setData(data.job_description);
      }, 100);
    }
  }, [apiRequest]); // `apiRequest` should be stable, hence it goes in the dependency array

  // Only trigger loadOpportunity when opportunity_id changes
  useEffect(() => {
    document.title = "Opportunity Details - Job Search Tracker";
    const pathArr = window.location.pathname.split("/");
    const opportunity_id = pathArr[2];

    if (opportunity_id && opportunity_id !== state.opportunity_id) {
      setState((prevState) => ({ ...prevState, opportunity_id }));
      loadOpportunity(opportunity_id);
    }
  }, [state.opportunity_id, loadOpportunity]); // Including loadOpportunity as a dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditorChange = () => {
    const descCard = document.getElementById("description_card_body");
    const ckeContent = descCard?.querySelector(".ck-content");
    const newVal = ckeContent?.ckeditorInstance.getData();
    setState((prevState) => ({ ...prevState, job_description: newVal }));
  };

  const handleDeleteOpportunity = async () => {
    await deleteOpportunity(JOB_OPPORTUNITY_API_URL + state.opportunity_id, state);
    window.location = "/opportunities";
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    await apiRequest(
      JOB_OPPORTUNITY_API_URL, state, 
      { method: 'POST' }
    );
    navigate("/opportunities")
  };

  const handleEditOpportunity = async (e) => {
    e.preventDefault();
    await apiRequest(
      `${JOB_OPPORTUNITY_API_URL}${state.opportunity_id}`,  // URL with the opportunity ID to update
      state,  // Data to update the opportunity
      { method: 'PUT' }  // PUT method to update
    );
    navigate("/opportunities")
  };

  const setCommentsCallback = (updatedComments) => {
    setState((prevState) => ({ ...prevState, comments: updatedComments }));
  };

  return (
    <Container className="flex">
      <Form onSubmit={state.opportunity_id === 0 ? handleCreateOpportunity : handleEditOpportunity}>
        <Card className="text-dark bg-light m-3">
          <CardTitle className="mx-4 my-2">
            <Row>
              <Col xxl="9" xl="8" lg="8" md="7" sm="5" xs="3">
                <strong>Opportunity Details</strong>
              </Col>
              <Col xxl="3" xl="4" lg="4" md="5" sm="7" xs="9" className="pull-right">
                <Button color="danger" className="mx-2 pull-right" onClick={handleDeleteOpportunity}>
                  <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete
                </Button>
                <Button color="primary" type="submit" className="mx-2 pull-right">
                  <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save
                </Button>
              </Col>
            </Row>
          </CardTitle>
          <CardBody className="bg-white">
            <Row id="status_recruiter_row">
              <Col lg="3" md="6" id="recruiter_name_field">
                <FormGroup>
                  <Label for="recruiter_name">Recruiter Name</Label>
                  <Input
                    type="text"
                    required
                    id="recruiter_name"
                    name="recruiter_name"
                    maxLength={64}
                    onChange={handleInputChange}
                    value={state.recruiter_name}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6" id="recruiter_company_field">
                <FormGroup>
                  <Label for="recruiter_company">Recruiter Company</Label>
                  <Input
                    type="text"
                    required
                    name="recruiter_company"
                    maxLength={64}
                    onChange={handleInputChange}
                    value={state.recruiter_company}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6" id="opportunity_status_field">
                <FormGroup>
                  <Label for="opportunity_status">Status</Label>
                  <Input
                    type="select"
                    required
                    name="opportunity_status"
                    onChange={handleInputChange}
                    value={state.opportunity_status}
                  >
                    <option value="6 - Opportunity Ignored">6 - Opportunity Ignored</option>
                    <option value="5 - Showed Opportunity Interest">5 - Showed Opportunity Interest</option>
                    <option value="4 - Recruiter Ignored Interest">4 - Recruiter Ignored Interest</option>
                    <option value="3 - Right to Represent Signed">3 - Right to Represent Signed</option>
                    <option value="2.7 - Right to Represent Ignored">2.7 - Right to Represent Ignored</option>
                    <option value="2.5 - Interviewed then Ignored">2.5 - Interviewed then Ignored</option>
                    <option value="2.3 - Rejected">2.3 - Rejected</option>
                    <option value="2 - Awaiting Feedback">2 - Awaiting Feedback</option>
                    <option value="1 - Actively Engaged">1 - Actively Engaged</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="email_received_at">Email Received At</Label>
                  <Input
                    type="datetime-local"
                    required
                    name="email_received_at"
                    onChange={handleInputChange}
                    value={state.email_received_at}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row id="title_empl_type_duriation_row">
              <Col lg="6" md="12">
                <FormGroup>
                  <Label for="job_title">Job Title</Label>
                  <Input
                    type="text"
                    required
                    name="job_title"
                    maxLength={128}
                    onChange={handleInputChange}
                    value={state.job_title}
                  />
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="employment_type">Employment Type</Label>
                  <Input
                    type="select"
                    required
                    name="employment_type"
                    onChange={handleInputChange}
                    value={state.employment_type}
                  >
                    <option value="">Select Type</option>
                    <option value="Contract">Contract</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Freelance">Freelance</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="job_duration">Contract Duration</Label>
                  <Input
                    type="text"
                    required
                    name="job_duration"
                    maxLength={64}
                    onChange={handleInputChange}
                    value={state.job_duration ?? ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row id="location_type_city">
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="location_type">Location Type</Label>
                  <Input
                    type="select"
                    required
                    name="location_type"
                    onChange={handleInputChange}
                    value={state.location_type}
                  >
                    <option value="">Select Location</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="In Office">In Office</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3" md="6">
                <FormGroup>
                  <Label for="location_city">Location City</Label>
                  <Input
                    type="text"
                    required
                    name="location_city"
                    maxLength={64}
                    onChange={handleInputChange}
                    value={state.location_city ?? ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row id="description_card">
              <Col lg="12">
                <div id="description_card_body">
                  <Editor handleChange={handleEditorChange} />
                </div>
              </Col>
            </Row>
            <Row id="comments_card">
              <Col lg="12">
                <Comments comments={state.comments} setComments={setCommentsCallback} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Form>
    </Container>
  );
};

export default OpportunityDetails;

