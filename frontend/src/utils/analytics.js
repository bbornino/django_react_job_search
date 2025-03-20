import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-8Y7EEDDKFX';  // Replace with your Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

// Track page views
export const logPageView = () => {
  ReactGA.send('pageview');
};
