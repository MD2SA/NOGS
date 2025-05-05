import { useState } from "react";
import axios from "axios";
import { LOGIN_URL, REGISTER_URL } from "../../assets/urls/djangoUrls";


export default function SignUp() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleUp = (e) => {
        e.preventDefault();
        setMessage('');
        axios.post(REGISTER_URL, formData)
            .then(response => {
                console.log(response.data);
                setMessage("User registered successfully!");
            })
            .catch(error => {
                console.error(error);
                setMessage("Something went wrong.");
            });
    }

    const handleIn = (e) => {
        e.preventDefault();
        setMessage('');
        axios.post(LOGIN_URL, formData)
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
        <div>
            <h2>Sign Up</h2>
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
            <button onClick={handleUp} >Sign Up</button>
            <button onClick={handleIn} >Sign In</button>
            {message && <p>{message}</p>}
        </div>
    );
}
