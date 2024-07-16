import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
/*import App from './App';*/
import Visits from './Components/Visits';

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>
//);

const root = ReactDOM.createRoot(document.getElementById('visits'));
root.render(
    <React.StrictMode>
        <Visits />
    </React.StrictMode>
);