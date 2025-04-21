import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import neu from './images/northeastern.jpg';
import { useAuthUser } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TopNav = () => { 
    const navigate = useNavigate();
    const { logout, user } = useAuthUser();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Handle window resize for responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
        window.localStorage.removeItem("user");
        window.dispatchEvent(new Event('storage'));
    };
    
    const gotoProfile = async () => {
        navigate('/joblist/profile');
    };
    
    const gotoHomeJob = async () => {
        navigate('/joblist');
    };
    
    const gotoDashboard = async () => {
        navigate('/joblist/dashboard');
    };
    
    return (
        <>
            {/* CSS for custom styling */}
            <style>
                {`
                    .navbar-black {
                        background-color: #000000 !important;
                    }
                    
                    .dropdown-toggle::after {
                        display: none !important;
                    }
                    
                    .profile-dropdown .dropdown-toggle {
                        background-color: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        color: white !important;
                        display: flex !important;
                        align-items: center !important;
                        padding: 0.5rem 1rem !important;
                        border-radius: 20px !important;
                        transition: background-color 0.2s !important;
                    }
                    
                    .profile-dropdown .dropdown-toggle:hover,
                    .profile-dropdown .dropdown-toggle:focus,
                    .profile-dropdown .dropdown-toggle:active {
                        background-color: #333333 !important;
                        box-shadow: none !important;
                    }
                    
                    .profile-dropdown .dropdown-menu {
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
                        border: none !important;
                        border-radius: 8px !important;
                        padding: 0.5rem 0 !important;
                        margin-top: 0.5rem !important;
                    }
                    
                    .profile-dropdown .dropdown-item {
                        padding: 0.6rem 1.5rem !important;
                        font-size: 0.9rem !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    
                    .profile-dropdown .dropdown-item:hover {
                        background-color: #f0f0f0 !important;
                    }
                    
                    .profile-dropdown .dropdown-item.text-danger:hover {
                        background-color: #ffeeee !important;
                    }
                    
                    .user-icon {
                        margin-right: 0.5rem;
                    }
                    
                    @media (max-width: 767px) {
                        .job-portal-title {
                            font-size: 1.25rem !important;
                        }
                        
                        .mobile-logo {
                            max-height: 35px !important;
                        }
                    }
                    
                    @media (orientation: landscape) and (max-width: 767px) {
                        .top-bar-profile {
                            padding-top: 0.25rem !important;
                            padding-bottom: 0.25rem !important;
                        }
                    }
                `}
            </style>
            
            <div id="top-nav-wrapper" className="container-fluid p-0">
                <div className="d-flex justify-content-between align-items-center navbar-black text-white py-2 px-3 px-md-4" id="top-bar-profile">
                    {/* Left side with logo */}
                    <div className={isMobile ? "d-flex" : "d-flex align-items-center"}>
                        <img 
                            src={neu} 
                            alt="Husky Logo" 
                            className={`mobile-logo ${isMobile ? "me-2" : "me-md-3"}`} 
                            style={{ maxHeight: isMobile ? '35px' : '40px' }} 
                        />
                    </div>
                    
                    {/* Center with title */}
                    <div className="position-absolute start-50 translate-middle-x">
                        <h1 className="job-portal-title mb-0 fs-4">Job Portal</h1>
                    </div>
                    
                    {/* Right side with user dropdown */}
                    <div className="profile-dropdown">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                <FaUserCircle size={isMobile ? 20 : 24} className="user-icon" />
                                <span className={isMobile ? "d-none d-sm-inline" : ""}>Hi {user.firstName}</span>
                                {isMobile && <span className="d-inline d-sm-none ms-1"><FaBars size={16} /></span>}
                            </Dropdown.Toggle>
                            
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={gotoHomeJob}>
                                    <i className="bi bi-house-door me-2"></i> Home
                                </Dropdown.Item>
                                <Dropdown.Item onClick={gotoDashboard}>
                                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                                </Dropdown.Item>
                                <Dropdown.Item onClick={gotoProfile}>
                                    <i className="bi bi-person me-2"></i> Profile
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout} className="text-danger">
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                
                <div className="p-3">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default TopNav;