import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import backgroundImage from '../../../wwwroot/images/background.png';
import logo from '../../../wwwroot/images/logo.png'; 

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username === "" || password === "") {
            setErrorMessage('Please enter username and password');
            return; 
        }

        setErrorMessage('');
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            console.log('Login successful:', response.data);
            setErrorMessage(''); 
            window.location.href = '/Home';  
            return; 
            // handle success
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid username or password');
            } else {
                console.log(error); 
                setErrorMessage('An error occurred, Please try again later.');
            }
        }
    }

    return (
        <div>
            <div className="split left">
                <div className="login-container">
                    <div>
                        <h1 className="login-text-h1">Login</h1>
                    </div>
                    <div>
                        <p className="login-text-p-left">Welcome Back! Please login to your account</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                            <div>
                                <button className="login-btn" type="submit">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="split right">
                <div className="background-container">
                    <img src={backgroundImage} alt="Background" className="background" />
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="login-text-h1-bold">Counselors Connect</h1>
                    <p className="login-text-p">Driving Student Connection</p>
                </div>
            </div>
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