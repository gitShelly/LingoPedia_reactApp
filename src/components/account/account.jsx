import {useContext} from "react"
import { UserContext } from "../usercontext";


export const Account = () => {
    const { user } = useContext(UserContext);

    return ( <div>
        <div>
        loggin in as {user.name}
        <button>logout</button>
        check this out 
        </div>
    </div> );
}
 
