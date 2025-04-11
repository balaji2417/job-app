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
    <div class="container-fluid" id="top-bar-profile" >
    <div class="row">
      <div class="col-sm text-center">
        <img src={neu} alt="Husky Logo"/>
      </div>
      <div class="col-sm text-center">
        <h1 class="Name">Job Portal</h1>
      </div>
      <div class="col-sm">
      <Dropdown>
  <Dropdown.Toggle variant="dark" id="dropdown-basic">
    Good Day {user.firstName}
  </Dropdown.Toggle>

  <Dropdown.Menu>
  <Dropdown.Item onClick={gotoHomeJob} >Home</Dropdown.Item>
    <Dropdown.Item onClick={gotoProfile}>Profile</Dropdown.Item>
    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
    
  </Dropdown.Menu>
</Dropdown>
      </div>
    </div>
    
    <div style={{ paddingTop: '60px' }}> {/* Adjust for navbar height if needed */}
        <Outlet /> {/* Renders nested route content */}
      </div>
    
  </div>

);
};

export default TopNav;