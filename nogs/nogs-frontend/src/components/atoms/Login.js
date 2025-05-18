import { useState } from "react";
import { useAuth } from "../AuthContext";


export default function Login({ changeScreen }) {

    const [formData, setFormData] = useState({ username: '', password: '', });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('Loading...')
        login(formData).then(result => setMessage(result.message));
    }

    return (
        <div className="account-container">
            <h2 className="title account-title">Login</h2>
            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="account-input"
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="account-input"
            />
            {message && <p className="account-message">{message}</p>}
            <button onClick={handleLogin} className="account-button">Login</button>
            <p onClick={changeScreen} className="account-link">Create account</p>
        </div>
    );
}
