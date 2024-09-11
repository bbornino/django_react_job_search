import {React, Component} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { JOB_OPPORTUNITY_API_URL } from "../constants";

import DataTableBase from './DataTableBase';
import {Button, Container, Row, Col} from 'reactstrap';