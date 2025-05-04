import { createContext, useContext, useState } from "react";
import SignUp from "./molecules/SignUp";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = null;
    const logout = null;

    return (
        <AuthContext.Provider value={{ user, login, logout }} >
            {children}
        </AuthContext.Provider >
    );
}

export const useAuth = () => useContext(AuthContext);
