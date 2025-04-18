import React, { useState, useEffect } from 'react';
import './JobListings.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";




const profile = () => {
  const { user, fetchRecords, records } = useAuthUser();

useEffect(() => {
    if (user && user.email) {
        fetchRecords(user.email);
    }
}, [user]); 
  

 return (
  <table className="table table-striped">
  <thead className="table-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Job Name</th>
      <th scope="col">Status</th>
      <th scope="col">Date Applied</th>
      <th scope="col">Change Status</th>
    </tr>
  </thead>
  <tbody>
    {records && records.length > 0 ? (
      records.map((record, index) => (
        <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{record.jobName}</td>
          <td>{record.status}</td>
          <td>{record.dateApplied}</td>
          <td>
            <select
              className="form-select"
              value={record.status} 
              onChange={(e) => handleStatusChange(e, index)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4">No records found.</td>
      </tr>
    )}
  </tbody>
</table>

 );
};

export default profile;