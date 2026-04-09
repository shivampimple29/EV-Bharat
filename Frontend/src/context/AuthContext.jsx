import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On app load — restore user if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res  = await fetch("https://ev-bharat-backend-j5s4.onrender.com/api/auth/me", { 
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
        else logout(); // token expired or invalid
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    if (jwt) localStorage.setItem("token", jwt); // ✅ fixed: skip if guest (jwt = null)
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Named export for direct useContext usage
export { AuthContext };

// Custom hook (cleaner alternative)
export const useAuth = () => useContext(AuthContext);
