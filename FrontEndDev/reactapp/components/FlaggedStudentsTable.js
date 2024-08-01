import React from 'react';

const FlaggedStudentsTable = ({ FlaggedStudents }) => {
    return (
        <div id="flagged-students" className="my-4">
            <h2 className="d-flex justify-content-center">Flagged Students</h2>
            
                <div className="table-container d-flex justify-content-center">
                <div className="round-table table-responsive">
                        <table id="flaggedStudentsTable">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Student ID</th>
                                    <th>Number of Visits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FlaggedStudents.slice(0, 4).map(student => (
                                    <tr key={student.studentID}>
                                        <td><a href="studentview/studentview" className="flaggedStudents ">{student.studentName}</a></td>
                                        <td>{student.studentID}</td>
                                        <td>{student.visitCount}</td>
                                    </tr>
                                    
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
            
        </div>
    );
};

export default FlaggedStudentsTable;
