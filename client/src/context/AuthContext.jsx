import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const ContextFile = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("EduUser");
      return storedUser ? JSON.parse(storedUser) : "";
    } catch (e) {
      return "";
    }
  });
  const [login, setLogin] = useState(false);

  useEffect(() => {
    setLogin(!!user);
  }, [user]);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser, login, setLogin }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
