import './App.css';
import neu from './images/northeastern.jpg';

import React ,{useState} from 'react';

import { Link } from 'react-router-dom';

export default function Home () {
  
  return (
      <div>
<div class="container-fluid" id="top-bar" >
    <div class="row">
      <div class="col-sm text-center">
        <img src={neu} alt="Husky Logo"/>
      </div>
      <div class="col-sm text-center">
        <h1 class="Name">Job Portal</h1>
      </div>
      <div class="col-sm">
       
      </div>
    </div>
  </div>
  <br>
  </br>
  <p>
  The Job Tracker Application is a comprehensive web-based platform designed to assist job seekers in managing their job search process. By connecting to external job platforms like LinkedIn, Glassdoor, and Indeed, the application provides real-time job listings based on the user's search keywords. It aims to help users track their applications, analyze performance metrics from various job sites, and streamline the entire job search journey. The application also offers features such as job status tracking, insights into job site performance, and the ability to apply for jobs directly from the platform.
The application’s core functionalities include user registration and login, a job search interface, an application tracker, and a performance dashboard. It allows users to create an account, search for jobs, apply to available positions, and monitor the progress of their applications. The system also provides insights into rejection rates and job availability from external platforms. This helps users optimize their job search strategy and make informed decisions based on real-time data.

  </p>
  <br></br>
  <br></br>

  <h2>Links to Login:</h2>
   <p ><Link  to ="login">Login here
                    </Link>
                    </p>
                    <p ><Link  to ="register">Register here
                    </Link>
                    </p>

      </div>
       
  );
}