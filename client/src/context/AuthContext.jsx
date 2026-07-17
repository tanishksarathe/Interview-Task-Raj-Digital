import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const ContextFile = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("EduUser")) || "",
  );
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
