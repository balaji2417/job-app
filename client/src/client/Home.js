import '../App.css';
import neu from '../images/northeastern.jpg';
import jobImage from '../images/jobapp.jpg';
import RadioButtons from './RadioButtons';
import React ,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Home () {
  
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
  

      </div>
       
  );
}