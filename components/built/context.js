import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";

import PageLoader from "./page_loader";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function Validate() {
            const user = await validateToken();
            const security = await validateSecurity(user);
            if (!security) {
                Router.push("/login");
                await new Promise(resolve => setTimeout(resolve, 1500));
                setIsLoading(false);
            } else {
                if (user) user.security = security;

                setCurrentUser(user);
                setIsLoading(false);
            }
        }

        Validate();
    }, [])

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
        } else if (result.status === 204)
            return 204;
        else 
            return 201
    }
    
    async function Logout() {
        setToken(undefined);
        Router.push("/login");
    }

    function GetSecurity(name) {
        if (!currentUser || !currentUser.security) return -1;
        
        for (const val of currentUser.security) {
            if (val.name === name) {
                return val.state;
            }
        }

        return -1;
    }

    async function validateToken() {
        const tokenString = JSON.parse(sessionStorage.getItem("token"));
        if (!tokenString || !Object.keys(tokenString).length) {
            console.log("No Token Found");
            Logout();
            return null;
        }

        const result = await axios.post("/api/auth/validate", 
        { email: tokenString.email, hash: tokenString.hash });

        if (result.status === 204) return Router.push("/login");
        else {
            setToken(tokenString);
            return tokenString;
        }
    }

    async function validateSecurity(user) {
        if (!user) return null;
        const result = await axios.post("/api/auth/security", { username: user.email });
        return result.data;
    }

    function setToken(token) {
        if (token) {
            sessionStorage.setItem("token", JSON.stringify(token));
            setCurrentUser(token);
        } else {
            sessionStorage.removeItem("token");
            setCurrentUser(undefined);
        }
    }

    const values = {
        currentUser,
        Signup,
        Login,
        Logout,
        GetSecurity
    };

    if (isLoading) return <PageLoader />

    return (
        <AuthContext.Provider value={values}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}