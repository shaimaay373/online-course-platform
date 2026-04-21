import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null
    };
  });

  const login = useCallback((userData, userToken) => {
    setAuth({ user: userData, token: userToken });
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const updateUser = useCallback((patch) => {
    setAuth((prev) => {
      if (!prev.user) return prev;
      const nextUser = { ...prev.user, ...patch };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return { ...prev, user: nextUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user: auth.user, 
      token: auth.token, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};