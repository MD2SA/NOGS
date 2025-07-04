import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LOGIN_URL, LOGOUT_URL, ME_URL, SIGNUP_URL } from "../assets/urls/djangoUrls";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLocation = () => {
        const hostname = window.location.hostname
        if (hostname === "localhost") {
            const port = window.location.port ? `:${window.location.port}` : "";
            const pathname = window.location.pathname;
            const search = window.location.search;
            const newUrl = `http://127.0.0.1${port}${pathname}${search}`;
            window.location.replace(newUrl);
            alert("Redirected to 127.0.0.1 because of login problems with localhost");
        }
    }

    useEffect(() => {
        handleLocation();
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

        // a user does login/logout/signup in another page sync this one
        const onStorageChange = (event) => {
            if (event.key === "auth-sync") {
                navigate('/profile');
                me();
            }
        };

        window.addEventListener("storage", onStorageChange);
        return () => window.removeEventListener("storage", onStorageChange);
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
            localStorage.setItem("auth-sync", Date.now());
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
            localStorage.setItem("auth-sync", Date.now());
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
            await api.get(LOGOUT_URL);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.setItem("auth-sync", Date.now());
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
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
