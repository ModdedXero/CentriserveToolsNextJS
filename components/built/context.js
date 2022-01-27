import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(undefined);

    async function Signup(username, password) {
        let result = await axios.post("/api/auth/signup", { email: username, password: password });

        if (result.status === 200) {
            return 200;
        } else 
            return 400;
    }

    async function Login(username, password) {
        const result = await axios.post("/api/auth/login", { email: username, password: password });

        if (result.status === 200) {
            setToken(result.data);
            return 200;
        } else if (result.status === 400)
            return 400;
        else 
            return 401
    }
    
    async function Logout() {
        setToken(undefined);
        Router.push("/login");
    }

    async function Validate() {
        const tokenString = JSON.parse(localStorage.getItem("token"));
        if (!tokenString || !Object.keys(tokenString).length) {
            console.log("No Token Found");
            Logout();
            return false;
        }

        const result = await axios.post("/api/auth/validate", 
        { email: tokenString.email, hash: tokenString.hash });
        
        if (result.status === 400) return Router.push("/login");
        else {
            setToken(tokenString);
            return true;
        }
    }

    function setToken(token) {
        if (token) {
            localStorage.setItem("token", JSON.stringify(token));
            setCurrentUser(token);
        } else {
            localStorage.removeItem("token");
            setCurrentUser(undefined);
        }
    }

    const values = {
        currentUser,
        Signup,
        Login,
        Logout,
        Validate
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

// export function SecureComponent({ children }) {
//     const { currentUser } = useAuth();
    
//     if (!currentUser) {
//         Router.push("/login");
//         return;
//     } else {
//         <div className="page-container">
//             {currentUser && children}
//         </div>
//     }
// }

export function SecureComponent({ children }) {
    const { Validate } = useAuth();

    useEffect(() => {
        async function CheckValidate() {
            await Validate();
        }

        CheckValidate();
    }, [])

    return (
        <div className="page-container">
            {children}
        </div>
    )
}