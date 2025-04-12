import Dropdown from 'react-bootstrap/Dropdown';
import neu from './images/northeastern.jpg';
import { useAuthUser } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TopNav = () => { 
    const navigate = useNavigate();
    const { logout,user } = useAuthUser();
      const handleLogout = async () => {
        await logout();
        navigate('/login');
    
        // Clear local storage or any session storage (optional)
        window.localStorage.removeItem("user");
    
        // Optional: Broadcast a message to other tabs
        window.dispatchEvent(new Event('storage'));
    };
    const gotoProfile = async () => {
      navigate('/joblist/profile');
  };
  const gotoHomeJob = async () => {
    navigate('/joblist');
};
    return (
      <div id="top-nav-wrapper" className="container-fluid">
      <div className="d-flex justify-content-between align-items-center px-3" id="top-bar-profile">
        <div>
          <img src={neu} alt="Husky Logo" style={{ maxHeight: '50px' }} />
        </div>
    
        <div className="text-center flex-grow-1">
          <h1 className="job-portal-title mb-0">Job Portal</h1>
        </div>
    
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Good Day {user.firstName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={gotoHomeJob}>Home</Dropdown.Item>
              <Dropdown.Item onClick={gotoProfile}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    
      <div style={{ paddingTop: '20px' }}>
        <Outlet />
      </div>
    </div>
    
);
};

export default TopNav;