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

import OpportunityList from "./components/OpportunityList";
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
              <NavItem><NavLink href="/">Home</NavLink></NavItem>
              <NavItem><NavLink href="/opportunities">Opportunities</NavLink></NavItem>
              <NavItem><NavLink href="/about">About</NavLink></NavItem>
              <NavItem><NavLink href="/release-history">Release History</NavLink></NavItem>
              <NavItem><NavLink href="/job-hunt-tips">Job Hunt Tips</NavLink></NavItem>
            </Nav>
          </Collapse>
        </Navbar>

          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/opportunities" element={<OpportunityList />} />
              <Route path="/job-hunt-tips" element={<JobHuntTips />} />
              <Route path="/release-history" element={<ReleaseHistory />} />
              <Route path="/about" element={<About />} />
          </Routes>
      </Router>
  );
  }
  
}

// export default App;
