import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom"
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, 
          UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import JobSiteList from "./components/JobSiteList";
import JobSiteView from "./components/JobSiteView";
import JobSiteEdit from "./components/JobSiteEdit";
import JobPostingList from "./components/JobPostingList";
import JobPostingEdit from "./components/JobPostingEdit";
import OpportunityList from "./components/OpportunityList";
import OpportunityDetails from "./components/OpportunityDetails";

import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import About from "./components/About";
import JobHuntTips from "./components/JobHuntTips";
import ReleaseHistory from "./components/ReleaseHistory";
import FinancialAssistance from "./components/FinancialAssistance";
import BooleanSearch from "./components/BooleanSearch";


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Router>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/" >Job Search Tracker</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem><NavLink href="/">Dashboard</NavLink></NavItem>

              {/* Static Pages Submenu */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Information
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem tag={Link} to="/about">About</DropdownItem>
                  <DropdownItem tag={Link} to="/about">User Guide</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to="/job-hunt-tips">Job Hunt Tips</DropdownItem>
                  <DropdownItem tag={Link} to="/boolean-search">Boolean Search</DropdownItem>
                  <DropdownItem tag={Link} to="/financial-assistance">Financial Assistance Programs</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to="/release-history">Release History</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>


              <NavItem><NavLink href="/job-sites">Job Sites</NavLink></NavItem>
              <NavItem><NavLink href="/job-postings">Job Postings</NavLink></NavItem>
              <NavItem><NavLink href="/opportunities">Opportunities</NavLink></NavItem>

              {/* Reports Submenu */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Reports
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem tag={Link} to="/reports/postingsAppliedSince">Postings Applied</DropdownItem>
                  <DropdownItem tag={Link} to="/reports/perSite">Per Site</DropdownItem>
                  <DropdownItem tag={Link} to="/reports/perWeek">Per Week</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              
            </Nav>
          </Collapse>
        </Navbar>

          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/job-sites" element={<JobSiteList />} />
              <Route path="/job-site-view/:id" element={<JobSiteView />} />
              <Route path="/job-site-edit" element={<JobSiteEdit />} />  {/* Matches New */}
              <Route path="/job-site-edit/:id" element={<JobSiteEdit />} />
              <Route path="/job-postings" element={<JobPostingList />} />
              <Route path="/job-posting-new/" element={<JobPostingEdit />} />
              <Route path="/job-posting-new/:id" element={<JobPostingEdit />} />
              <Route path="/job-posting-edit/:id" element={<JobPostingEdit />} />
              <Route path="/opportunities" element={<OpportunityList />} />
              <Route path="/opportunity-details" element={<OpportunityDetails />} />
              <Route path="/opportunity-details/:id" element={<OpportunityDetails />} />
              <Route path="/reports/:reportType/:referenceDate?" element={<Reports />} />
              <Route path="/job-hunt-tips" element={<JobHuntTips />} />
              <Route path="/release-history" element={<ReleaseHistory />} />
              <Route path="/boolean-search" element={<BooleanSearch />} />
              <Route path="/financial-assistance" element={<FinancialAssistance />} />
              <Route path="/about" element={<About />} />
          </Routes>
      </Router>
  );
  }
  
}

// export default App;
