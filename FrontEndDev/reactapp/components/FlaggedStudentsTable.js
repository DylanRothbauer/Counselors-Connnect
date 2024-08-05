import React, { useState} from 'react';

const FlaggedStudentsTable = ({ FlaggedStudents }) => {
    const [expandedTds, setExpandedTds] = useState({}); //expands table element

    const expandTd = (index) => {
        console.log(index)

        setExpandedTds(prevState => ({
            ...prevState,
            [index]: !prevState[index] // Toggle the expanded state
        }));
    }

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
                                        {<td style={{ maxWidth: expandedTds[1] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(1)}>{student.studentName}</button> </td>}
                                        {<td style={{ maxWidth: expandedTds[2] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(2)}>{student.studentID}</button> </td>}
                                        {<td style={{ maxWidth: expandedTds[3] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(3)}>{student.visitCount}</button> </td>}               
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
