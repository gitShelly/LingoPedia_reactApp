import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setuser] = useState(null);
  const [ready, setready] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setuser(data);
        setready(true);
      });
    }
  });

  const handleLogout = async () => {
    try {

      await axios.post("/logout");
      setuser(null);
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setuser, ready, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}
