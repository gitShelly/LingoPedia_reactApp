
// import { createContext, useState, useEffect,useContext } from "react";
// import axios from "axios";

// export const UserContext = createContext({});
// export function UserContextProvider({ children }) {
//   const [user, setUser] = useState({"hi":"ge"});
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       axios
//         .get("/profile")
//         .then(({ data }) => {
//           setUser(data);
//           setReady(true);
//         })
//         .catch((error) => {
//           console.error("Error fetching user profile:", error);
//         });
//     }
//   }, [user]);

//   const handleSetUser = (userData) => {
//     console.log("hiii");
//     // Ensure that userData is correctly structured
//     setUser(userData);
//     setReady(true);
//   };

//   return (
//     <UserContext.Provider value={{ user, handleSetUser, ready }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setuser] = useState(null);
  const [ready,setready]=useState(false)

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setuser(data);
        setready(true);
      });
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, setuser,ready }}>
      {children}
    </UserContext.Provider>
  );
}

