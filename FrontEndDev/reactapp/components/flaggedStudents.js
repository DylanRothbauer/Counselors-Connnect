import React from 'react';

const FlaggedStudents = ({ flaggedStudents }) => {
    return (
        <div>
            <h2>Flagged Students</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Number of Visits</th>
                    </tr>
                </thead>
                <tbody>
                    {flaggedStudents.slice(0, 4).map(student => (
                        <tr key={student.studentID} onClick={() => window.location.href = `/student/${student.studentID}`}>
                            <td>{student.studentName}</td>
                            <td>{student.studentID}</td>
                            <td>{student.visitCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlaggedStudents;
