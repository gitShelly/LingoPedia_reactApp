import { useContext,useState } from "react";
import { UserContext } from "../usercontext";
import {Navigate} from "react-router-dom";
import axios from "axios";

export const Account = () => {
  const { user,setuser } = useContext(UserContext);
  const [isredirect, setisredirect] = useState(null);
  
  const logout = async () => {
    await axios.post("/logout");
    setisredirect("/")
    setuser(null);
  };

  if(isredirect){
    return <Navigate to={isredirect} />
  }
  return (
    <div>
      <div>
        loggin in as {user.name}
        <button onClick={logout}>logout</button>
        check this out
      </div>
    </div>
  );
};
