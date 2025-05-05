import { useState } from "react";
import { useAuth } from "../AuthContext";


export default function SignUp({changeScreen}) {

    const [formData, setFormData] = useState({ username: '', first_name: '', last_name: '', email: '', password: '', });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const { signup } = useAuth();

    const handleSignup = (e) => {
        e.preventDefault();
        signup(formData).then(result => setMessage(result.message));
    }

    return (
        <div className="account-container">
            <h2 className="title account-title">Sign Up</h2>
            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="account-input"
            />
            <input
                name="first"
                placeholder="First"
                value={formData.first_name}
                onChange={handleChange}
                className="account-input"
            />
            <input
                name="last"
                placeholder="Last"
                value={formData.last_name}
                onChange={handleChange}
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
            <button onClick={handleSignup} className="account-button">Sign Up</button>
            <p onClick={changeScreen} className="account-link">Login into account</p>
        </div>
    );
}
