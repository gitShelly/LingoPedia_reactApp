import { useContext } from "react";
import { UserContext } from "../usercontext";
import axios from "axios";

export const Account = () => {
  const { user } = useContext(UserContext);

  const logout = async () => {
    await axios.post("/logout");
  };

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
