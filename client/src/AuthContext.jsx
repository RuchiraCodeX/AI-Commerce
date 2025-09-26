import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // On mount, check for token and fetch user
  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data && !data.message) setUser(data);
          else setUser(null);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [token]);

  // Login: save token and fetch user
  const login = async (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && !data.message) setUser(data);
      else setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Signup: just a helper to call login after successful signup
  const signup = async (token) => {
    await login(token);
  };

  // Logout: clear everything
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
