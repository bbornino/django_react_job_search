import React, { useState }  from 'react';
import {  useAuthUser, useIsAuthenticated, useSignOut  } from 'react-auth-kit';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import {
  Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useApiRequest } from "./utils/useApiRequest";

import Welcome from "./components/Welcome";
import About from "./components/About";
import JobHuntTips from "./components/JobHuntTips";
import ReleaseHistory from "./components/ReleaseHistory";
import FinancialAssistance from "./components/FinancialAssistance";
import BooleanSearch from "./components/BooleanSearch";
import Login from "./components/Login";
import Register from './components/Register';

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import JobSiteList from "./components/JobSiteList";
import JobSiteView from "./components/JobSiteView";
import JobSiteEdit from "./components/JobSiteEdit";
import JobPostingList from "./components/JobPostingList";
import JobPostingEdit from "./components/JobPostingEdit";
import OpportunityList from "./components/OpportunityList";
import OpportunityDetails from "./components/OpportunityDetails";
import Reports from "./components/Reports";
import Secret from "./components/Secret";


function App() {
  const isAuthenticated = useIsAuthenticated(); // Hook to check if user is authenticated
  const user = useAuthUser(); // Hook to get the user object
  const signOut = useSignOut();  // Hook to handle sign out
  const [isOpen, setIsOpen] = useState(false);
  // useSetupAxiosInterceptor(); // This will set up the Axios interceptor
  const { apiRequest } = useApiRequest();
  const navigate = useNavigate(); // Hook to navigate after login
  
  // Toggle the navigation bar
  const toggle = () => setIsOpen((prevState) => !prevState);
  
  const handleLogout = async () => {
    // Make the logout API call to invalidate the token
    await apiRequest('/api/logout/', {}, { method: 'POST' }); // Adjust the endpoint if needed
    signOut();  // Sign out the user
    localStorage.removeItem("access_token");

    navigate("/");// Redirect to home page after logout
  };

  // Note: <BrowserRouter> is defined in index.js!
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Job Search Tracker</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
        
        {isAuthenticated() ? (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </NavItem>
            {/* Static Pages Submenu */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Information
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={Link} to="/about">About</DropdownItem>
                <DropdownItem tag={Link} to="/job-hunt-tips">Job Hunt Tips</DropdownItem>
                <DropdownItem tag={Link} to="/boolean-search">Boolean Search</DropdownItem>
                <DropdownItem tag={Link} to="/financial-assistance">Financial Assistance Programs</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/release-history">Release History</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="/job-sites">Job Sites</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/job-postings">Job Postings</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/opportunities">Opportunities</NavLink>
            </NavItem>

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
        ) : (
          <Nav className="ml-auto" navbar>
            <NavItem><NavLink href="/">Welcome</NavLink></NavItem>
            <NavItem><NavLink href="/about">About</NavLink></NavItem>
            <NavItem><NavLink href="/job-hunt-tips">Job Hunt Tips</NavLink></NavItem>
            <NavItem><NavLink href="/boolean-search">Boolean Search</NavLink></NavItem>
            <NavItem><NavLink href="/financial-assistance">Financial Assistance Programs</NavLink></NavItem>
            <NavItem><NavLink href="/release-history">Release History</NavLink></NavItem>
          </Nav>
        )}
        

        <Nav className="ms-auto" navbar>
        {isAuthenticated() ? (
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Hi {user()?.first_name || 'First Name Not Available'}!
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag={Link} to="/edit-profile">Edit Profile</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          <>
            <NavItem>
              <NavLink tag={Link} to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/register">Register</NavLink>
            </NavItem>
          </>
        )}
        </Nav>
        </Collapse>
      </Navbar>

      <Routes>
        {/* Conditional Routing for / based on Authentication */}
        <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Welcome />} />

        {/* Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/job-hunt-tips" element={<JobHuntTips />} />
        <Route path="/release-history" element={<ReleaseHistory />} />
        <Route path="/financial-assistance" element={<FinancialAssistance />} />
        <Route path="/boolean-search" element={<BooleanSearch />} />

        {/* Protected Routes */}
        <Route path="/secret" element={<ProtectedRoute element={<Secret />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/job-sites" element={<ProtectedRoute element={<JobSiteList />} />} />
        <Route path="/job-site-view/:id" element={<ProtectedRoute element={<JobSiteView />} />} />
        <Route path="/job-site-new" element={<ProtectedRoute element={<JobSiteEdit />} />} />
        <Route path="/job-site-new/:id" element={<ProtectedRoute element={<JobSiteEdit />} />} />
        <Route path="/job-site-edit" element={<ProtectedRoute element={<JobSiteEdit />} />} />
        <Route path="/job-site-edit/:id" element={<ProtectedRoute element={<JobSiteEdit />} />} />
        <Route path="/job-postings" element={<ProtectedRoute element={<JobPostingList />} />} />
        <Route path="/job-posting-new/:id" element={<ProtectedRoute element={<JobPostingEdit />} />} />
        <Route path="/job-posting-edit/:id" element={<ProtectedRoute element={<JobPostingEdit />} />} />
        <Route path="/opportunities" element={<ProtectedRoute element={<OpportunityList />} />} />
        <Route path="/opportunity-details" element={<ProtectedRoute element={<OpportunityDetails />} />} />
        <Route path="/opportunity-details/:id" element={<ProtectedRoute element={<OpportunityDetails />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
        <Route path="/reports/:reportType/:referenceDate?" element={<ProtectedRoute element={<Reports />} />} />
      </Routes>
    </div>
  );
}

export default App;
