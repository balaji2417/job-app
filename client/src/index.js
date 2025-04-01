import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' (for React 18)
import './index.css';
import App from './client/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './client/Login';
import Home from './client/Home';

// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the new method
root.render(
 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element = {<App />}/>
        <Route path="register" element={<Login />} />
      </Routes>
    </BrowserRouter>
 
);

// Optional: If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
