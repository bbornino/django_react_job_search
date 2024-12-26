import React, { Component } from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import Cookies from 'js-cookie';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, 
          UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axiosInstance from "./axiosInstance";

import {
  JobSiteList,
  JobSiteView,
  JobSiteEdit,
  JobPostingList,
  JobPostingEdit,
  OpportunityList,
  OpportunityDetails,
  Dashboard,
  Reports,
  About,
  JobHuntTips,
  ReleaseHistory,
  FinancialAssistance,
  BooleanSearch,
  Login,
  Secret,
  Welcome,
  ProtectedRoute
} from "./components";

export default class App extends Component {
  state = {
    isOpen: false,
    user: null,
    access_token: null,
  };

  toggle() {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }

  async handleLogout() {
    try {
      await axiosInstance.post('/api/logout_user/', {}, { withCredentials: true });
      Cookies.remove('refresh_token');  // Remove refresh token from cookies
      this.setState({ user: null, access_token: null  });
      Navigate('/welcome');  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

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
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem><NavLink href="/">Welcome</NavLink></NavItem>
              <NavItem><NavLink href="/dashboard">Dashboard</NavLink></NavItem>

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
              {localStorage.getItem("access_token") !== null ? (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Hi B!
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem tag={Link} to="/edit-profile">Edit Profile</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.handleLogout}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <>
                    <NavItem><NavLink tag={Link} to="/login">Login</NavLink></NavItem>
                    <NavItem><NavLink tag={Link} to="/register">Register</NavLink></NavItem>
                  </>
              )}

            </Nav>
          </Collapse>
        </Navbar>

        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
            <Route path="/welcome" element={<Welcome />} />
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
