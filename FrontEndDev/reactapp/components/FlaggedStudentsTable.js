import React from 'react';

const FlaggedStudents = ({ FlaggedStudents }) => {
    return (
        <div>
            <h2>Flagged Students</h2>
            <a href="studentview/studentview" className="flaggedStudents">
            <table id="flaggedStudentsTable">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Number of Visits</th>
                    </tr>
                </thead>
                <tbody>
                    {flaggedStudents.slice(0, 4).map(student => (
                        <tr key={student.studentID}>
                            <td>{student.studentName}</td>
                            <td>{student.studentID}</td>
                            <td>{student.visitCount}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </a>
        </div>
    );
};

export default FlaggedStudents;
