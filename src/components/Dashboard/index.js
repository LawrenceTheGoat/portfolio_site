import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from "./home";
import Login from '../Login';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('onAuthStateChanged:', user);
            if(user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        // cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);


    return (
       <div>
           {user ? <Home /> : <Login />}
       </div>
    )
}

export default Dashboard;