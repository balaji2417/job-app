import './App.css';
import neu from './images/northeastern.jpg';
import React, { useState } from 'react';
import { useAuthUser } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import jobImage from './images/login_image.jpeg';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, error_call, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  if(isAuthenticated) {
    navigate('/joblist');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Both email and password are required!');
      return;
    }
    await login(email, password);
    navigate('/joblist');
  };

  return (
    <div className="App">
      <div className="container-fluid" id="top-bar">
        <div className="row align-items-center">
          <div className="col-3 text-start">
            <img src={neu} alt="Husky Logo" />
          </div>
          <div className="col-6 text-center">
            <h1 className="Name">Job Portal</h1>
          </div>
          <div className="col-3">
            {/* Reserved for future navigation */}
          </div>
        </div>
      </div>
      
      <div id="signup" style={{backgroundImage: `url(${jobImage})`}}>
        <div id="signup_in">
          <h2 className="cac">Log in</h2>
          
          {error_call && 
            <div className="error-message">
              {error_call}
            </div>
          }
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username" 
              placeholder="Username" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <br />
            
            <button 
              type="submit" 
              className="btn" 
              id="btn-signup"
            >
              Log in
            </button>
          </form>
          
          <div className="nav-links">
            <p>New user? 
              <Link to="/register">
                Sign Up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;