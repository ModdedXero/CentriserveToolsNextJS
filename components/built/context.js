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
        } else if (result.status === 204)
            return 204;
        else 
            return 201
    }
    
    async function Logout() {
        setToken(undefined);
        Router.push("/login");
    }

    async function ValidateToken() {
        const tokenString = JSON.parse(localStorage.getItem("token"));
        if (!tokenString || !Object.keys(tokenString).length) {
            console.log("No Token Found");
            Logout();
            return false;
        }

        const result = await axios.post("/api/auth/validate", 
        { email: tokenString.email, hash: tokenString.hash });

        if (result.status === 204) return Router.push("/login");
        else {
            setToken(tokenString);
            return true;
        }
    }

    async function ValidateSecurity(name, level) {
        if (!currentUser) return -1;
        const result = await axios.post("/api/auth/security", { username: currentUser.email, security: name });
        if (result.data < level) return -1;
        else return result.data;
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
        ValidateToken,
        ValidateSecurity
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export function SecureComponent({ name=null, level=-1, failover="/", children }) {
    const { ValidateToken, ValidateSecurity } = useAuth();

    useEffect(() => {
        async function CheckValidate() {
            await ValidateToken();
            if (name && level) 
                if (await ValidateSecurity(name, level) === -1) return Router.push(failover);
        }

        CheckValidate();
    }, [])
    
    return (
        <div className="page-container">
            {children}
        </div>
    )
}