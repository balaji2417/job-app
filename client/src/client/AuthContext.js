import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error_call, setErrorCall] = useState('');
  const [user, setUser] = useState(null);

  // Use effect to show an alert when error_call changes
 
  useEffect(() => {
    
    const fetchUserData = async () => {
      setErrorCall('');
      try {
        const res = await fetch(` http://localhost:5000/api/me`, {
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

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      
      setIsAuthenticated(true);
      setUser(userData);
      setErrorCall('');
      
      
    } else {
      
      setErrorCall('Invalid Credentials');
      setIsAuthenticated(false);
      setUser(null);
      
    }
  };

  const logout = async () => {
    await fetch(`http://localhost:5000/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  const register = async (email, password, name) => {
    const res = await fetch(`http://localhost:5000/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      const userData = await res.json();
      
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, register, logout,error_call }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthUser = () => useContext(AuthContext);