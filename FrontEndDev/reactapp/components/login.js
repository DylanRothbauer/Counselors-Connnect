import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/auth/login', { username, password });
            console.log('Login successful:', response.data);
            setErrorMessage(''); 
            window.location.href = '/';  
            return; 
            // handle success
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid username or password');
            } else {
                console.log(error); 
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}> 
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} 
                <button type="submit">Login</button>
            </form>
        </div>
    );


}




export default Login;

const login = ReactDOM.createRoot(document.getElementById('login'));
login.render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>
);