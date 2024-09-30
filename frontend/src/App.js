import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Outlet,
} from "react-router-dom"
import {Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import JobSiteList from "./components/JobSiteList";
import JobSiteView from "./components/JobSiteView";
import JobSiteEdit from "./components/JobSiteEdit";
import OpportunityList from "./components/OpportunityList";
import OpportunityDetails from "./components/OpportunityDetails";
import About from "./components/About";
import JobHuntTips from "./components/JobHuntTips";
import ReleaseHistory from "./components/ReleaseHistory";

const Home = () => {
  const  navigate = useNavigate();

  return (
    <div>
      <h2>Home Page</h2>
      <p>content: To be Determined...</p>
      <button onClick={() =>
        navigate("/contact")}>Go to Contact</button>
    </div>
  );
}


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
              {/* <NavItem><NavLink href="/">Home</NavLink></NavItem> */}
              <NavItem><NavLink href="/about">About</NavLink></NavItem>
              <NavItem><NavLink href="/job-sites">Job Sites</NavLink></NavItem>
              <NavItem><NavLink href="/opportunities">Opportunities</NavLink></NavItem>
              <NavItem><NavLink href="/job-hunt-tips">Job Hunt Tips</NavLink></NavItem>
              <NavItem><NavLink href="/release-history">Release History</NavLink></NavItem>
            </Nav>
          </Collapse>
        </Navbar>

          <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<About />} />
              <Route path="/job-sites" element={<JobSiteList />} />
              <Route path="/job-site-view/:id" element={<JobSiteView />} />
              <Route path="/job-site-edit" element={<JobSiteEdit />} />  {/* Matches New */}
              <Route path="/job-site-edit/:id" element={<JobSiteEdit />} />
              <Route path="/opportunities" element={<OpportunityList />} />
              <Route path="/opportunity-details" element={<OpportunityDetails />} />
              <Route path="/opportunity-details/:id" element={<OpportunityDetails />} />
              <Route path="/job-hunt-tips" element={<JobHuntTips />} />
              <Route path="/release-history" element={<ReleaseHistory />} />
              <Route path="/about" element={<About />} />
          </Routes>
      </Router>
  );
  }
  
}

// export default App;
