
import '../App.css';
import neu from '../images/northeastern.jpg';
import React ,{useState} from 'react';


import jobImage from '../images/jobapp.jpg';
import { Link } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    
    setError('');
    setSuccess('');

    
    if (!email || !password) {
      setError('Both email and password are required!');
      return;
    }

    try {
      
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify that you're sending JSON
        },
        body: JSON.stringify({ email, password }), // Send email and password in the body
    });
    
      const data = await response.json();

      
      if (response.ok) {
        alert("Hello");
        setSuccess(data.message);
       
        
      } else {
        alert("Bala");
        setError(data.message);  
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert("Hello");
      setError('An error occurred during login. Please try again later.');
    }
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
  {error && <div style={{ color: 'red' }}>{error}</div>}
  {success && <div style={{ color: 'green' }}>{success}</div>}
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
          <Link  to ="/login">Signup here
          </Link>
        </p>
      </div>
      </div>
      </div>
    </div>
  );
}

export default App;
