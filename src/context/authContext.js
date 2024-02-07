import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const backend = process.env.REACT_APP_BACKEND;

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingForAuth, setCheckingForAuth] = useState(true);

  useEffect(() => {
    fetch(backend + "/api/auth/checkToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    }).then((res) => {
      if (res.ok) {
        setCheckingForAuth(false);
        setAuthenticated(true);
      } else if (res.status !== 401 && !res.ok) {
        console.error("Failed to check token");
        setCheckingForAuth(false);
      }
    });
  }, []);

  const login = async (username, password) => {
    const res = await fetch(backend + "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      window.localStorage.setItem("token", data.token);
      setAuthenticated(true);
      return { authenticated: true };
    } else {
      const data = await res.json();
      console.error(data);
    }
    return { authenticated: false };
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, login, logout, checkingForAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
