export const JOB_OPPORTUNITY_API_URL = "http://localhost:8000/api/email_opportunity/";
export const JOB_SITE_API_URL = "http://localhost:8000/api/job_site/";

export const formatInputFieldDateTime = (originalDateTime) => {
    // Properly format date-time
    // Going into the database, the time zone is saved.
    // The front end widget does not need a time zone, nor the 'T'.
    // From: 2024-09-02T14:19:00-07:00
    // To: 2024-09-02 14:19:00   (no time zones)
    // console.log("Stripping the Time Zone from " + originalDateTime);
    var originalDtArr = originalDateTime.split('T')
    var originalDtTimeArr = originalDtArr[1].split('-')
    return originalDtArr[0] + ' ' + originalDtTimeArr[0]
}

export const formatDisplayDateTime = (rawDate) => {
    // From a code perspective, I would love to live with the default:
    // const theDate = new Date(rawDate).toLocaleString('en-US')
    // 9/5/2024, 5:42:00 PM
    // but... you can't turn off the seconds!
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