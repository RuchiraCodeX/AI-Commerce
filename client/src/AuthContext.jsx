import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Fetch user from token
  const fetchUser = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && !data.message) {
        setUser(data);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        setToken("");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("token");
      setToken("");
    } finally {
      setLoading(false);
    }
  };

  // On mount: check for token
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login: save token and fetch user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser({ ...data });
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup: register user and login automatically
  const signup = async (name, email, password, isAdmin = false) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, isAdmin }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser({ ...data });
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (err) {
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
