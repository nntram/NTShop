import { createContext, useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const setAuth = () => {
      const token = localStorage.getItem("userAuth");
      if (token) {
        try{
          setCurrentUser(jwt_decode(token));
        }
        catch{
          setCurrentUser(null);
        }       
      } else {
        setCurrentUser(null);
      }
    };
    setAuth()
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { 
  return useContext(AuthContext) 
}