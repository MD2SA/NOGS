import axios from "axios";
import { useState } from "react";
import { LOGIN_URL } from "../../assets/urls/djangoUrls";
import "../../css/Profile.css"


export default function Login() {

    const [formData, setFormData] = useState({ username: '', password: '', });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('');
        axios.post(LOGIN_URL, formData, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setMessage("SignIn successfull!");
            })
            .catch(error => {
                console.error(error);
                setMessage("Something went wrong.");
            });
    }

    return (
        <div className="account-container">
            <h2 class="title account-title">Login</h2>
            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            {message && <p>{message}</p>}
            <button onClick={handleLogin} >Login</button>
        </div>
    );
}
