import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LOGIN_URL, LOGOUT_URL, SIGNUP_URL } from "../assets/urls/djangoUrls";

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifica se há usuário logado ao carregar (ex: refresh da página)
    useEffect(() => {
        async function loadUserFromStorage() {
            const token = getCSRFToken();
            if (token) {
                try {
                    // Aqui você pode adicionar uma requisição para verificar
                    // o token se necessário, ou carregar do localStorage
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error('Failed to load user', error);
                }
            }
            setLoading(false);
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

    api.interceptors.request.use(config => {
        const token = getCSRFToken();
        console.log(token);
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
            isAuthenticated: !!user,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
