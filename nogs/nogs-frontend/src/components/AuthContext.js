import { createContext, useContext, useState } from "react";
import axios from "axios";
import { LOGIN_URL, SIGNUP_URL } from "../assets/urls/djangoUrls";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = (data) => {
        return axios.post(LOGIN_URL, data, { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
                return { success: true, message: 'Login successful!' };
            })
            .catch(error => {
                return { success: false, message: 'Something went wrong.' };
            });
    }

    const signup = (data) => {
        return axios.post(SIGNUP_URL, data, { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
                return { success: true, message: 'Signup successful!' };
            })
            .catch(error => {
                return { success: false, message: 'Something went wrong.' };
            });
    }

    const logout = null;

    return (
        <AuthContext.Provider value={{ user, login, signup }} >
            {children}
        </AuthContext.Provider >
    );
}

export const useAuth = () => useContext(AuthContext);
