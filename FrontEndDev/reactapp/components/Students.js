import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'

const Students = () => {
    const [students, setStudents] = useState([]);
    const [topics, setTopics] = useState([]);


    useEffect(() => {
        fetch('/api/Student')
            .then(response => response.json())
            .then(data => {
                setStudents(data);
                //setTopics(data);
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    return (
        <div>
            <h1>Students</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Grade</th>
                        <th>Advisor</th>
                        <th>Visits</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.StudentID}>
                            <td>{student.StudentID}</td>
                            <td>{student.FirstName}</td>
                            <td>{student.LastName}</td>
                            <td>{student.Grade}</td>
                            <td>{student.AdvisorName}</td>
                            <td>{student.Visits}</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
};

export default Students;

const stud = ReactDOM.createRoot(document.getElementById('students'));
stud.render(
    <React.StrictMode>
        <Students />
    </React.StrictMode>
);