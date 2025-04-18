import React, { useState, useEffect } from 'react';
import './JobListings.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";



const Profile = () => {
  const { user, fetchRecords, records, updateRecord } = useAuthUser();
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (user && user.email) {
      fetchRecords(user.email);
    }
  }, [user, fetchRecords]); 

  const handleStatusChange = (id, newStatus) => {
    setStatusMap(prev => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdateClick = async (id) => {
    try {
      const newStatus = statusMap[id] || 'Interview Scheduled';
      await updateRecord(user.email, newStatus, id);
      await fetchRecords(user.email);  // ensure fresh data
    } catch (error) {
      console.error('Error updating status or fetching records:', error);
    }
  };

  return (
    <table className="table table-striped">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Job Name</th>
          <th>Status</th>
          <th>Date Applied</th>
          <th>Change Status</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        {records && records.length > 0 ? (
          records.map((record, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{record.jobName}</td>
              <td>{record.status}</td>
              <td>{record.dateApplied}</td>
              <td>
                <select
                  className="form-select"
                  value={statusMap[record.jobListingId] || record.status}
                  onChange={(e) => handleStatusChange(record.jobListingId, e.target.value)}
                >
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button 
                  className="mark-update"
                  onClick={() => handleUpdateClick(record.jobListingId)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">No records found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Profile;