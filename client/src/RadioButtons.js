import React, { useState } from 'react';
import './App.css';
const RadioButtons = () => {
  // State to hold the selected radio button value
  const [selectedOption, setSelectedOption] = useState('');

  // Handle change when a radio button is clicked
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div class = "user-type">
   
       <label> Gender:
     
        <label class = "labelG">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={selectedOption === 'Male'}
            onChange={handleChange}
          />
          Male
        </label>
     

      
        <label class = "labelG">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={selectedOption === 'Female'}
            onChange={handleChange}
          />
          Female
        </label>
        </label>

      
      
      

     
    </div>
  );
};

export default RadioButtons;