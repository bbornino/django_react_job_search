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
import {Navbar} from 'reactstrap';

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



function App() {
  return (
      <Router>
          <nav className="bg-white border-b border-gray-100">
              <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/opportunities">Opportunities</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/release-history">Release History</Link></li>
                  <li><Link to="/job-hunt-tips">Job Hunt Tips</Link></li>
                  
              </ul>
          </nav>
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

export default App;
