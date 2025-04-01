import React, { useState, useEffect } from 'react';
import '../JobListings.css';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import neu from '../images/northeastern.jpg';
import jobImage from '../images/jobapp.jpg';

const JobListings = () => {
  const RAPIDAPI_KEY = '7ccc597d8dmsh9c6142f89f1c247p104a9ejsn06f611acc57a';
  const [currentQuery, setCurrentQuery] = useState('developer');
  const [currentLocation, setCurrentLocation] = useState('');
  const [message, setMessage] = useState('Good Morning');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(currentQuery)}${currentLocation ? '%20in%20' + encodeURIComponent(currentLocation) : ''}&page=1&num_pages=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(data.data || []);
      
      if (!data.data || data.data.length === 0) {
        setError('No jobs found matching your criteria');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const markAsApplied = (id,description) => {
    alert(id);
    alert(description);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = document.getElementById('jobQuery').value.trim();
    const location = document.getElementById('location').value.trim();

    if (!query) {
      setError('Please enter a job title');
      return;
    }

    setCurrentQuery(query);
    setCurrentLocation(location);
  };

  useEffect(() => {
    fetchJobs();
  }, [currentQuery, currentLocation]);
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // This sends cookies if any (necessary for cookie-based sessions)
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Show a message and redirect to login
            alert(data.message); // "Logged out successfully"
            navigate('/login'); // Redirect user to the login page
        } else {
            // Handle any errors
            alert("Logout failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during logout:", error);
        alert("An error occurred during logout.");
    }
};
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
          <button type="submit" style = {{width:"50%"}} class="btn "id = "btn-signup" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>
      <div className="job-listings-container">
      <h1 className="title">Job Listings</h1>

      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          id="jobQuery"
          defaultValue={currentQuery}
          placeholder="Job title (e.g. 'developer')"
          className="search-input"
        />
        <input
          type="text"
          id="location"
          defaultValue={currentLocation}
          placeholder="Location (e.g. 'canada')"
          className="search-input"
        />
        <button type="submit" className="search-button">
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="spinner">Loading jobs...</div>
        </div>
      ) : (
        <div className="jobs-container">
          {jobs.map((job, index) => (
            <div className="job" key={index}>
              <h2>{job.job_title || 'No title available'}</h2>
              <h3>{job.employer_name || 'Company not specified'}</h3>
              <div className="job-meta">
                {job.job_country && <span>📍 {job.job_country}</span>}
                {job.job_employment_type && <span>🕒 {job.job_employment_type}</span>}
                {job.job_posted_at_timestamp && (
                  <span>📅 {new Date(job.job_posted_at_timestamp * 1000).toLocaleDateString()}</span>
                )}
                {job.job_is_remote && <span>🏠 Remote</span>}
              </div>
              {job.job_salary && <p><strong>Salary:</strong> {job.job_salary}</p>}
              <p className="job-description">
                {job.job_description ? job.job_description.substring(0, 250) + '...' : 'No description available'}
              </p>
              {job.job_apply_link && (
                <div className="apply-actions">
                  <a 
                    href={job.job_apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="apply-link"
                  >
                    Apply Now
                  </a>
                  <button 
                  onClick={() => markAsApplied(job.job_id,job.job_description)}
                  className="mark-applied"
                >
                  Mark as Applied
                </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    </div>
  );
};

export default JobListings;