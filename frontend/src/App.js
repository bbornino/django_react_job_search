import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
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

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Secret from "./components/Secret";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);  // Bind the handleLogout method
    this.state = {
      isOpen: false,
      user: null,  // State to track the logged-in user
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  // Logout function
  handleLogout() {
    debugger
    // Clear user session (e.g., tokens)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Update user state to null
    this.setState({ user: null });

    // Optionally, redirect the user to the login page
    this.props.history.push('/login');  // Or use 'navigate' if you're using 'react-router-dom v6'
  }

  // In App.js, add a method to handle user login
  handleLogin = (user) => {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    const enableAuth = process.env.REACT_APP_ENABLE_AUTH === 'true';  // Get the value of REACT_APP_ENABLE_AUTH

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

              {/* Secret menu item */}
              {enableAuth && user && (
                <NavItem><NavLink tag={Link} to="/secret">Secret</NavLink></NavItem>
              )}

            </Nav>

            {/* Right-Aligned Login/Register Section */}
            <Nav className="ms-auto" navbar>
              {user ? (
                <NavItem>
                  <NavLink href="#" onClick={this.handleLogout}>
                    {user.firstName || user.username} (Logout)
                  </NavLink>
                </NavItem>
              ) : (
                enableAuth && (
                  <>
                    <NavItem><NavLink tag={Link} to="/login">Login</NavLink></NavItem>
                    <NavItem><NavLink tag={Link} to="/register">Register</NavLink></NavItem>
                  </>
                )
              )}
            </Nav>
          </Collapse>
        </Navbar>

        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
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

            {/* Protected Routes */}
            <Route
                path="/secret"
                element={
                  <ProtectedRoute>
                    <Secret />
                  </ProtectedRoute>
                }
              />
        </Routes>
      </Router>
    );
  }
}
