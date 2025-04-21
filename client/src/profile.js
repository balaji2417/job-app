import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const profileStyles = {
  container: {
    padding: '20px',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  subheader: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
    fontWeight: 'normal',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  tableHeader: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'left',
    padding: '12px 15px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  tableRowHover: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '0.9rem',
    verticalAlign: 'middle',
  },
  selectInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    fontSize: '0.85rem',
  },
  updateButton: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '0.85rem',
  },
  updateButtonHover: {
    backgroundColor: '#2980b9',
  },
  jobLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
  jobLinkHover: {
    textDecoration: 'underline',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontWeight: '500',
    display: 'inline-block',
    fontSize: '0.85rem',
  },
  // Status specific styles
  statusApplied: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    color: '#2980b9',
  },
  statusInterview: {
    backgroundColor: 'rgba(241, 196, 15, 0.2)',
    color: '#d35400',
  },
  statusSelected: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#27ae60',
  },
  statusRejected: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#c0392b',
  },
  noRecords: {
    padding: '20px',
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: '15px',
    textAlign: 'center',
    flex: '1 1 150px',
    margin: '0 10px 10px 0',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  }
};

const getResponsiveStyles = () => {
  const width = window.innerWidth;
  
  if (width < 576) { // Mobile
    return {
      table: {
        fontSize: '0.8rem',
      },
      tableCell: {
        padding: '8px 10px',
      },
      header: {
        fontSize: '1.5rem',
        textAlign: 'center',
      },
      subheader: {
        fontSize: '1rem',
        textAlign: 'center',
      }
    };
  } else if (width < 768) { // Tablet
    return {
      tableCell: {
        padding: '10px 12px',
      },
      header: {
        fontSize: '1.6rem',
      }
    };
  }
  
  return {}; // Default (desktop)
};

const Profile = () => {
  const { user, fetchRecords, records, updateRecord,getFinishedJobs,finishedJobs } = useAuthUser();
  const [statusMap, setStatusMap] = useState({});
  const [responsiveStyles, setResponsiveStyles] = useState(getResponsiveStyles());
  const [localFinishedJobs, setFinishedJobs] = useState(new Set());

  useEffect(() => {
    const fetchFinishedJobs = async () => {
      getFinishedJobs();
      
        alert("Finished Jobs there");
        finishedJobs.forEach(id=> {
          setAppliedJobs(prev => new Set(prev).add(id));
        })
        
      
    };
    fetchFinishedJobs();
  }, [user]);  
  

  useEffect(() => {
    if (user && user.email) {
      fetchRecords(user.email);
    }
  
    const handleResize = () => {
      setResponsiveStyles(getResponsiveStyles());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, fetchRecords]);

  const handleStatusChange = (id, newStatus) => {
    setStatusMap(prev => ({ ...prev, [id]: newStatus }));
  };
  
  const gotoWebsite = (link) => {
    window.open(link, '_blank');
  }

  const handleUpdateClick = async (id, platformName) => {
    try {
      const newStatus = statusMap[id] || 'Interview Scheduled';
      alert(newStatus);
      if(newStatus == 'Selected' || newStatus == 'Rejected') {
        alert(localFinishedJobs)
        setFinishedJobs(prev => new Set(prev).add(id));
      }
      
      await updateRecord(user.email, newStatus, id, platformName);
      await fetchRecords(user.email);  
    } catch (error) {
      console.error('Error updating status or fetching records:', error);
    }
  };

  // Function to format date (remove time part)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Applied':
        return { ...profileStyles.statusBadge, ...profileStyles.statusApplied };
      case 'Interview Scheduled':
        return { ...profileStyles.statusBadge, ...profileStyles.statusInterview };
      case 'Selected':
        return { ...profileStyles.statusBadge, ...profileStyles.statusSelected };
      case 'Rejected':
        return { ...profileStyles.statusBadge, ...profileStyles.statusRejected };
      default:
        return { ...profileStyles.statusBadge, ...profileStyles.statusApplied };
    }
  };

  // Count applications by status
  const getStatusCounts = () => {
    const counts = {
      total: records?.length || 0,
      applied: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };
    
    if (records && records.length > 0) {
      records.forEach(record => {
        if (record.status === 'Applied') counts.applied++;
        else if (record.status === 'Interview Scheduled') counts.interview++;
        else if (record.status === 'Selected') counts.selected++;
        else if (record.status === 'Rejected') counts.rejected++;
      });
    }
    
    return counts;
  };

  const isJobFinished = (jobId) => {
    console.log("Job Id",localFinishedJobs.has(jobId));
    return localFinishedJobs.has(jobId);
};

  const statusCounts = getStatusCounts();

  return (
    <div style={profileStyles.container} className="profile-job-tracker">
      <h1 style={profileStyles.header} className="profile-header">
        Hey there! Here's your job application tracker
      </h1>
      <p style={profileStyles.subheader} className="profile-subheader">
        Keep an eye on your progress and update your application statuses as you go
      </p>
      
      
      <table style={profileStyles.table} className="profile-job-table">
        <thead>
          <tr>
            {['#', 'Job Name', 'Status', 'Date Applied', 'Company Name', 'Link', 'Platform Name', 'Change Status', 'Update'].map((header, idx) => (
              <th key={idx} style={profileStyles.tableHeader} className="profile-table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records && records.length > 0 ? (
            records.map((record, index) => (
              <tr 
                key={index} 
                style={profileStyles.tableRow}
                className="profile-table-row"
              >
                <td style={profileStyles.tableCell} className="profile-table-cell">{index + 1}</td>
                <td style={profileStyles.tableCell} className="profile-table-cell">{record.jobName}</td>
                <td style={profileStyles.tableCell} className="profile-table-cell">
                  <span style={getStatusStyle(record.status)}>
                    {record.status}
                  </span>
                </td>
                <td style={profileStyles.tableCell} className="profile-table-cell">
                  {formatDate(record.dateApplied)}
                </td>
                <td style={profileStyles.tableCell} className="profile-table-cell">{record.companyName}</td>
                <td style={profileStyles.tableCell} className="profile-table-cell">
                  <a 
                    onClick={() => gotoWebsite(record.jobLink)} 
                    style={profileStyles.jobLink}
                    className="profile-job-link"
                  >
                    Job Link
                  </a>
                </td>
                <td style={profileStyles.tableCell} className="profile-table-cell">{record.platformName}</td>
                <td style={profileStyles.tableCell} className="profile-table-cell">
                  <select
                    style={profileStyles.selectInput}
                    className="profile-status-select"
                    value={statusMap[record.jobListingId] || record.status}
                    onChange={(e) => handleStatusChange(record.jobListingId, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td style={profileStyles.tableCell} className="profile-table-cell">
                  <button 
                    style={profileStyles.updateButton}
                    className="profile-update-button"
                    onClick={() => handleUpdateClick(record.jobListingId, record.platformName)}
                    disabled={isJobFinished(record.jobListingId)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={profileStyles.noRecords} className="profile-no-records">
                No job applications found. Start tracking your applications!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;