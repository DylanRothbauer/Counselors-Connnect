import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const Visits = () => {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        fetch('/api/Visit')
            .then(response => response.json())
            .then(data => setVisits(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Visits</h1>
            <table>
                <thead>
                    <tr>
                        <th>Visit ID</th>
                        <th>Student ID</th>
                        <th>Counselor ID</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>File</th>
                        <th>File Path</th>
                        <th>Parents Called</th>
                        <th>Length</th>
                    </tr>
                </thead>
                <tbody>
                    {visits.map(visit => (
                        <tr key={visit.visitID}>
                            <td>{visit.visitID}</td>
                            <td>{visit.studentID}</td>
                            <td>{visit.counselorID}</td>
                            <td>{new Date(visit.date).toLocaleDateString()}</td>
                            <td>{visit.description}</td>
                            <td>{visit.file ? 'Yes' : 'No'}</td>
                            <td>{visit.filePath}</td>
                            <td>{visit.parentsCalled ? 'Yes' : 'No'}</td>
                            <td>{visit.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Visits;

// React DOM rendering
const VisitsTable = ReactDOM.createRoot(document.getElementById('VisitsTable'));
VisitsTable.render(
    <React.StrictMode>
        <Visits />
    </React.StrictMode>
);
