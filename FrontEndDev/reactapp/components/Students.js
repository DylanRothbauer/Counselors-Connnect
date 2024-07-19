import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const StudentsList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch('/api/Student')
            .then(response => response.json())
            .then(data => {
                setStudents(data);
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    return (
        <div>
            <h1>Students</h1>
            <p>
                <a href="/students/create">Create New</a>
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Grade</th>
                        <th>Advisor</th>
                        <th>Visits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.studentID}>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.grade}</td>
                            <td>{student.advisorName}</td>
                            <td>{student.visits}</td>
                            <td>
                                <a href={`/students/edit/${student.StudentID}`}>Edit</a> |
                                <a href={`/students/details/${student.StudentID}`}>Details</a> |
                                <a href={`/students/delete/${student.StudentID}`}>Delete</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsList;

// React DOM rendering
const student = ReactDOM.createRoot(document.getElementById('students'));
student.render(
    <React.StrictMode>
        <StudentsList />
    </React.StrictMode>
);