// import React, { useState, useEffect } from 'react'; // No need for useState/useEffect for responsiveStyles anymore
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; // Keep Bootstrap if you use other components from it
import './dashboard.css'; // Import the new CSS file

const Dashboard = () => {
  const { user } = useAuthUser();
  const navigate = useNavigate();

  // Navigate to different sections
  const navigateTo = (path) => {
    navigate(path);
  };

  // Card background colors (applied via inline style for now, could also move to CSS if needed)
   const cardBackgroundColors = [
     'rgba(208, 190, 190, 0.5)', // LightBlue
     'rgba(255, 182, 193, 0.5)', // LightPink
     'rgba(152, 251, 152, 0.5)'  // PaleGreen
   ];

    // Icon background colors (applied via inline style for now)
   const iconBackgroundColors = [
     'rgba(206, 213, 227, 0.7)', // CornflowerBlue
     'rgba(186, 163, 170, 0.7)', // PaleVioletRed
     'rgba(162, 181, 170, 0.7)'    // SeaGreen
   ];


  return (
    <div className="dashboard-container">
      {/* Decorative blobs using CSS classes */}
      <div className="dashboard-blob blob-top-right"></div>
      <div className="dashboard-blob blob-bottom-left"></div>
      <div className="dashboard-blob blob-middle-left"></div>
      <div className="dashboard-blob blob-small-top"></div>

      {/* Main content area */}
      <div className="dashboard-main-content">
        {/* Left side - Profile area */}
        <div className="dashboard-profile-section">
          <div className="profile-pic-container">
            {user && user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="profile-pic"
              />
            ) : (
              <div className="profile-placeholder">
                {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <h2 className="welcome-text">
            Hey {user ? user.name || "there" : "there"}!
          </h2>
          <p className="welcome-subtext">
            What would you like to do today?
          </p>
        </div>

        {/* Right side - Feature cards */}
        <div className="dashboard-feature-section">
          {/* Job Search Feature */}
          <div
            className="dashboard-feature-card"
            style={{ backgroundColor: cardBackgroundColors[0] }} // Apply background color here
            onClick={() => navigateTo('/job-search')}
            // Remove onMouseEnter/onMouseLeave - handled by CSS :hover
          >
            <div
                className="dashboard-feature-icon"
                style={{ backgroundColor: iconBackgroundColors[0] }} // Apply icon background color here
            >
              🔍
            </div>
            <div className="dashboard-feature-content">
              <h3 className="feature-title">Wanna search for jobs?</h3>
              <p className="feature-description">
                Discover opportunities tailored just for you! Find your dream job today.
              </p>
            </div>
          </div>

          {/* Performance Metrics Feature */}
          <div
            className="dashboard-feature-card"
             style={{ backgroundColor: cardBackgroundColors[1] }}
            onClick={() => navigateTo('/metrics')}
            // Remove onMouseEnter/onMouseLeave
          >
            <div
                 className="dashboard-feature-icon"
                 style={{ backgroundColor: iconBackgroundColors[1] }}
            >
              📊
            </div>
            <div className="dashboard-feature-content">
              <h3 className="feature-title">See your performance metrics</h3>
              <p className="feature-description">
                Track your progress and get insights on your job search journey!
              </p>
            </div>
          </div>

          {/* Application Tracking Feature */}
          <div
            className="dashboard-feature-card"
             style={{ backgroundColor: cardBackgroundColors[2] }}
            onClick={() => navigateTo('/applications')}
            // Remove onMouseEnter/onMouseLeave
          >
             <div
                 className="dashboard-feature-icon"
                 style={{ backgroundColor: iconBackgroundColors[2] }}
             >
              📝
            </div>
            <div className="dashboard-feature-content">
              <h3 className="feature-title">Track your applications</h3>
              <p className="feature-description">
                Stay organized! Keep tabs on where you've applied and what's next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Remove the old dashboardStyles object and getResponsiveStyles function
// const dashboardStyles = { ... };
// const getResponsiveStyles = () => { ... };

export default Dashboard;