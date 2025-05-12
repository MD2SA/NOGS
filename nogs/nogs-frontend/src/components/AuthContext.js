import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LOGIN_URL, LOGOUT_URL, ME_URL, SIGNUP_URL } from "../assets/urls/djangoUrls";

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function loadUserFromStorage() {
            const token = getCSRFToken();
            if (token) {
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error('Failed to load user', error);
                }
            }
        }
        loadUserFromStorage();
    }, []);

    function getCSRFToken() {
        const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
        return token;
    }

    const login = async (data) => {
        try {
            const response = await api.post(LOGIN_URL, data);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, message: response.data.message || 'Login successful!' };
        } catch (error) {
            const message = error.response?.data?.message ||
                error.response?.data?.detail ||
                'Login failed. Please check your credentials.';
            return { success: false, message };
        }
    }

    const signup = async (data) => {
        try {
            const response = await api.post(SIGNUP_URL, data);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, message: response.data.message || 'Signup successful!' };
        } catch (error) {
            const message = error.response?.data?.message ||
                error.response?.data?.detail ||
                'Signup failed. Please check your data.';
            return { success: false, message };
        }
    }

    const logout = async () => {
        try {
            // await api.get(LOGOUT_URL, {
            //     headers: { 'X-CSRFToken': getCSRFToken() }
            // });
            await api.get(LOGOUT_URL);
            setUser(null);
            localStorage.removeItem('user');
            return { success: true, message: 'Logout successful!' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Logout failed.'
            };
        }
    };

    const me = async () => {
        try {
            const response = await api.get(ME_URL)
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return {
                success: true,
                user: response?.data
            };
        } catch (error) {
            console.log(error);
            setUser(null)
            localStorage.removeItem('user');
            return {
                success: false,
                user: null,
            }
        }
    }

    api.interceptors.request.use(config => {
        const token = getCSRFToken();
        if (token)
            config.headers['X-CSRFToken'] = token;
        // if (token && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        //     config.headers['X-CSRFToken'] = token;
        // }
        return config;
    }, error => Promise.reject(error));

    return (
        <AuthContext.Provider value={{
            api,
            user,
            signup,
            login,
            logout,
            me,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
