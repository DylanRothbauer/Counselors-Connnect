import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import backgroundImage from '../../../wwwroot/images/background.png';
import logo from '../../../wwwroot/images/logo.png'; 

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [rememberMe, setRememberMe] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username === "" || password === "") {
            setErrorMessage('Please enter username and password');
            return; 
        }

        setErrorMessage('');
        try {
            const response = await axios.post('/api/auth/login', { username, password, rememberMe});
            console.log('Login successful:', response.data);
            setErrorMessage(''); 
            window.location.href = '/Home';  
            return; 
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
        <div className="container-fluid custom-container-fluid">
            <div className="row">
                <div className="col-lg-6">
                    <div className="mobile-logo d-lg-none">
                        <img src={logo} alt="Logo" className="login-page-logo" />
                    </div>
                    <div className="for-logo row d-flex align-items-center">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8">
                            <div className="login-info-container">
                                <h1>Login</h1>
                                <p>Welcome Back! Please login to your account</p>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Username"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="checking">
                                        <div className="row">
                                            <div className="col-6 d-flex align-items-center">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                    />
                                                    Remember Me
                                                </label>
                                            </div>
                                            <div className="col-6 text-end">
                                                <a href="/forgot-password" className="forgot">Forgot Password?</a>
                                            </div>
                                        </div>
                                    </div>
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                    <button className="btn w-100" type="submit">Login</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
                {/* Background Image Section */}
                <div className="col-lg-6">
                    <div className="background-image-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
                        <div className="logo-text-container">
                            <img src={logo} alt="Logo" />
                            <h1 className="">Counselors Connect</h1>
                            <p className="">Driving Student Connection</p>
                        </div>
                    </div>
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