
import '../App.css';
import neu from '../images/northeastern.jpg';
import React ,{useState} from 'react';
import { useAuthUser } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import jobImage from '../images/jobapp.jpg';
import { Link } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login,error_call } = useAuthUser();
  const navigate = useNavigate();

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
  < div id="signup"
        style={{
          backgroundImage: `url(${jobImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          height: 'calc(100vh - 60px)', 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
  <div id="signup_in">
  <h2 class = "cac" >Log in</h2>
  {error_call && <div style={{ color: 'red' }}>{error_call}</div>}
      <form onSubmit={handleSubmit}>
      <input type="text" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}}class="form-control" id="username" name="username" placeholder="Username" required
      value={email}
      onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}}  class="form-control" id="password" name="password" placeholder="Password" required
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>
        
        <br></br>
        <button type="submit" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} class="btn "id = "btn-signup">Log in</button>
      </form>
      <div class="nav-links">
        <p >New user? 
          <Link  to ="/register">Signup here
          </Link>
        </p>
      </div>
      </div>
      </div>
    </div>
  );
}

export default App;
