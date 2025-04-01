
import '../App.css';
import neu from '../images/northeastern.jpg';
import jobImage from '../images/jobapp.jpg';
import RadioButtons from './RadioButtons';
import { Link } from 'react-router-dom';

export default function Login () {
  
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
      <form >
      <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="username" name="username" placeholder="Username" required/>
      <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="FirstName" name="FirstName" placeholder="First Name" required/>
      <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="LastName" name="LastName" placeholder="Last Name" required/>
        <input type="password" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="password" name="password" placeholder="Password" required/>
        <input type="text" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="Id" name="Id" placeholder="Enter your MailId " required/>
        <input type="date" class="form-control" style = {{width:"90%",   marginLeft:"20px",marginRight:"20px",justifyContent: 'center',}} id="Id" name="Id" placeholder="Enter your DOB " required/>
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


