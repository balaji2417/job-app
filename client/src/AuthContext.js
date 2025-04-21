import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error_call, setErrorCall] = useState('');
  const [user, setUser] = useState(null);
  const [jobIds,setJobIds] = useState(null);
  const [countStatus, setCountStatus] = useState(null);
  const [records,setRecords] = useState(null);

  // Use effect to show an alert when error_call changes
 
  useEffect(() => {
    
    const fetchUserData = async () => {
      setErrorCall('');
      try {
        const res = await fetch(`http://localhost:10000/api/me`, {
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
          const data = await res.json();
        
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        
        console.error("Error fetching user data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getJobId = async () => {
    try{
      const response = await fetch('http://localhost:10000/api/myJobIds', {
        method: "GET",
        credentials: "include",
 
      });
      const data = await response.json();
      setJobIds(data.jobIds)
     
    }
    catch (error){
 
        console.log("Error fetching Job Ids:",error);
 
    }
   
  };

  const getCountStatus = async (email,platformName) => {
    try {
      const res = await fetch('http://localhost:10000/api/getCount', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          platformName
        }),
      });
  
      if (res.ok) {
        const userData = await res.json();
        setCountStatus(userData.records);
      } else {
        console.error("Insert failed with status:", res.status);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const insertApplication = async (
    email, jobId, status, currentDateTime,
    dateUpdated, notes, jobTitle,
    employer_name, apply_link, publisher
  ) => {
    try {
      const res = await fetch('http://localhost:10000/api/application', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          jobId,
          status,
          dateApplied: currentDateTime,
          dateUpdated,
          notes,
          jobTitle,
          employer_name,
          apply_link,
          publisher
        }),
      });
  
      if (res.ok) {
        return;
      } else {
        console.error("Insert failed with status:", res.status);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };


  const fetchRecords = async (email) => {
    try {
        const res = await fetch('http://localhost:10000/api/getRecords', {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

       
        if (res.ok) {
            const userData = await res.json();
            
            setRecords(userData.records);
        } else {
            console.log("Server error, status:", res.status);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
};

const updateRecord = async  (email,value,id,platformName) => {
  const res = await fetch('http://localhost:10000/api/updateRecord', {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "application/json" },
    body:JSON.stringify({email,value,id,platformName}),

  });
}

const deleteRecord = async (email,id,platformName) => {
  const res = await fetch('http://localhost:10000/api/deleteRecord',{
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify({email,id,platformName}),
  });
}
  const login = async (email, password) => {
    const res = await fetch('http://localhost:10000/api/login', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      
      
      setIsAuthenticated(true);
      setUser(userData.user);
      
      setErrorCall('');
      
      
    } else {
      const data = await res.json();
      setErrorCall(data.message);
      setIsAuthenticated(false);
      setUser(null);
      
    }
  };

  const logout = async () => {
    await fetch(`http://localhost:5000/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  const register = async (email, password, firstName,lastName,dob) => {
    
    const res = await fetch(`http://localhost:10000/api/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName,lastName,dob }),
    });

    if (res.ok) {
      const userData = await res.json();
      
     
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, deleteRecord, jobIds, getJobId, getCountStatus,countStatus, user, login, register, logout,error_call,fetchRecords,insertApplication,records,updateRecord}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthUser = () => useContext(AuthContext);