import React from 'react';
import ReactDOM from 'react-dom/client'; // Import for React 18
import './index.css';
import App from './client/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './client/AuthContext'; // Import Auth Context
import Login from './client/Login';
import Home from './client/Home';
import RequireAuth from './client/RequireAuth'
import JobListings from './client/JobListings';
 
// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
 
// Render the app inside AuthProvider
root.render(
<AuthProvider> {/* Wrap entire app with AuthProvider */}
<BrowserRouter>
<Routes>
<Route path="/" element={<Home />} />
<Route path="login" element={<App />} />
<Route path="register" element={<Login />} />
<Route path="joblist" element={
    <RequireAuth>
         <JobListings />
    </RequireAuth>
    
    
    } />
</Routes>
</BrowserRouter>
</AuthProvider>
);
 
// Optional: If you want to start measuring performance
reportWebVitals();