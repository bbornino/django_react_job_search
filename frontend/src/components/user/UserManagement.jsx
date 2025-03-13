import React, { useState, useEffect, useCallback, useRef  } from "react";
import { useNavigate } from 'react-router-dom';
import { JOB_POSTING_API_URL, JOB_SITE_API_URL, formatInputFieldDateTime } from "constants";
import {Form, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useApiRequest } from "utils/useApiRequest";

const UserManagement = () => {
    const [user, setUser] = useState({
        email: '',
        first_name: '',
        last_name: '',
        bio: '',
        user_greeting: '',
        color_mode: 'light',
        dashboard_first_date: '',
        dashboard_second_date: ''
    });

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = ""
    })
}

export default UserManagement;