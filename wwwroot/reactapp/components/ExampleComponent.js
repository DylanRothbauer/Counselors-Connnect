import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const Example = () => {

    return (
        <div>
            <h3>Example Component</h3>
        </div>
    );
};

export default Example;

//React DOM rendering
const visits = ReactDOM.createRoot(document.getElementById("example-component"));
visits.render(
    <React.StrictMode>
        <Example />
    </React.StrictMode>
);