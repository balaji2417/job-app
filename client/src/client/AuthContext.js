import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error,setError] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    alert(isAuthenticated);
    const fetchUserData = async () => {
      
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
          credentials: "include",
        });

        if (res.ok) {
          alert("Data okay");
          setIsAuthenticated(true);
          const data = await res.json();
        
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        alert("Error, error");
        console.error("Error fetching user data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      alert("Inside Login ?");
      setIsAuthenticated(true);
      setUser(userData);
      return "Correct";
    } else {
      setIsAuthenticated(false);
      setUser(null);
      SpeechSynthesisErrorEvent();
    }
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  const register = async (email, password, name) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      const userData = await res.json();
      alert("Inside Register:");
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthUser = () => useContext(AuthContext);