import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  function login(user, token) {
    setUser(user);
    setToken(token);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Role checking functions
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isVendor = () => {
    return user?.role === 'vendor';
  };

  const isUser = () => {
    return user?.role === 'user' || user?.role === 'consumer';
  };

  const isLoggedIn = () => {
    return !!(user && token);
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user?.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      login, 
      logout,
      isAdmin,
      isVendor,
      isUser,
      isLoggedIn,
      getUserRole,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Easy hook for all components
export function useAuth() {
  return useContext(AuthContext);
}