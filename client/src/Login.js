
import './App.css';
import neu from './images/northeastern.jpg';
import jobImage from './images/jobapp.jpg';
import { useAuthUser } from "./AuthContext";
import RadioButtons from './RadioButtons';
import React ,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login () {
  const [email, setEmail] = useState('');
  
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob,setDob] = useState('');
    const [error, setError] = useState('');
    
    const { register } = useAuthUser();
    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const today = new Date();
      const dob_inter = new Date(dob);
      let age = today.getFullYear() - dob_inter.getFullYear();
      const monthDifference = today.getMonth() - dob_inter.getMonth();
      
      // ✅ FIXED LINE
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob_inter.getDate())) {
          age--;
      }
      
      
      setError('');
      
     
      
      if (!email || !password || !firstName || !lastName || !dob) {
        setError('Fill in all fields!');
        return;
      }
       
      if(age < 18 ) {
        setError('Age must be greater than 18');
        return;
      }
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email!');
        return;
      }

     

      if(password.includes(email) || password.length <8) {
        setError('Password should not contain username or password should be greater than 8 ');
        return;
      }


      await register(email, password, firstName, lastName, dob);
      navigate('/login');
    
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
  <h2 class = "cac" >Create an Account</h2>
  {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
      
      <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="FirstName" name="FirstName" placeholder="First Name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      required/>
      <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="LastName" name="LastName" placeholder="Last Name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required/>
        <input type="password" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="password" name="password" placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required/>
        <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}}  name="Id" placeholder="Enter your MailId "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required/>
        <input type="date" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}}  name="Id" placeholder="Enter your DOB " 
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required/>
        <RadioButtons/>
        <br></br>
        <button type="submit" class="btn " style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id = "btn-signup">Sign Up</button>
      </form>
      <div class="nav-links">
        <p >Already have an account? <Link  to ="/">Login here
                  </Link>
                  </p>
      </div>
      </div>
      </div>

      </div>
       
  );
}


