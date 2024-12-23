const BASE_API_URL = process.env.REACT_APP_API_URL;

export const JOB_OPPORTUNITY_API_URL = BASE_API_URL + 'email_opportunity/';
export const JOB_SITE_API_URL = BASE_API_URL + 'job_site/';
export const JOB_POSTING_API_URL = BASE_API_URL + 'job_posting/';
export const DASHBOARD_API_URL = BASE_API_URL + 'dashboard/';
export const REPORT_API_URL = BASE_API_URL + 'report/';

export const formatInputFieldDateTime = (originalDateTime) => {
    if (originalDateTime === null) return null;
    // Properly format date-time
    // Going into the database, the time zone is saved.
    // The front end widget does not need a time zone, nor the 'T'.
    // From: 2024-09-02T14:19:00-07:00
    // To: 2024-09-02 14:19:00   (no time zones)

    var originalDtArr = originalDateTime.split('T')
    var originalDtTimeArr = originalDtArr[1].split('-')
    return originalDtArr[0] + ' ' + originalDtTimeArr[0]
}

export const formatDisplayDateTime = (rawDate) => {
    if (rawDate === null) return null;
    // From a code perspective, I would love to live with the default:
    // const theDate = new Date(rawDate).toLocaleString('en-US')
    // 9/5/2024, 5:42:00 PM
    // but... you can't easily turn off the seconds!
    // return: Tuesday, Sep 10, 2024, 5:42 AM
    const theDate = new Date(rawDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour12:true,
        hour:'numeric',
        minute:'numeric'})
    return theDate
}

// return: Sep 10, 2024
export const formatDisplayDate = (rawDate) => {
    if (rawDate === undefined || rawDate === null) return null;
    
    const theDate = new Date(rawDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'})
    return theDate
}

