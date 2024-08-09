import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Switch, useParams } from 'react-router-dom';

const EditStudent = () => {
    const { studentID } = useParams(); // Extract studentID from URL parameter
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [grade, setGradeLevel] = useState('');
    const [advisorName, setAdvisor] = useState('');

    useEffect(() => {
        if (studentID) {
            fetchStudentDetails(studentID);
        }
    }, [studentID]);

    const fetchStudentDetails = async (studentID) => {
        try {
            const response = await fetch(`/api/Student/GetStudentById?studentid=${studentID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student details');
            }
            const data = await response.json();
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setGradeLevel(data.grade.toString());
            setAdvisor(data.advisorName);
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            studentID,
            firstName,
            lastName,
            grade: parseInt(grade),
            advisorName
        };
        
        try {
            const response = await fetch(`/api/Student/UpateStudent?studentid=${studentID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message ?? json.Message);
            }

            // Redirect to student dashboard
            window.location.href = `/StudentView/StudentView`;

        } catch (error) {
            console.error('Error updating student:', error.message);
            alert("There was an error with updating this student");
        }
    };

    const handleCancel = () => {
        // Navigate back to students list
        window.location.href = '/StudentView/StudentView';
    };

    return (
        <div className="container m-auto edit-student-component">
            <div className="row">
                <div className="col my-3">
                    <div id="student-table-container">
                        <div className="student-table p-3">
                            <form id="my-form" onSubmit={handleSubmit}>
                                <div className="row align-items-end">
                                    <div className="col">
                                        <div className="row">
                                            <p>Student ID:</p>
                                        </div>

                                        <div className="row">
                                            <input id="inputs"
                                                type="text" // Maybe in future we can exclude numbers from input
                                                placeholder={studentID}
                                                value={studentID}
                                                disabled

                                            />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="row">
                                            <p>First Name:</p>
                                        </div>

                                        <div className="row">
                                            <input id="inputs"
                                                type="text"
                                                placeholder="First name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="row">
                                            <p>Last Name:</p>
                                        </div>

                                        <div className="row">
                                            <input id="inputs"
                                                type="text"
                                                placeholder="Last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="row">
                                            <p>Grade Level:</p>
                                        </div>

                                        <div className="row">
                                            <input id="inputs"
                                                type="number"
                                                min="1"
                                                max="12"
                                                placeholder="Grade level"
                                                value={grade}
                                                onChange={(e) => setGradeLevel(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="row">
                                            <p>Advisor:</p>
                                        </div>

                                        <div className="row">
                                            <input id="inputs"
                                                type="text"
                                                placeholder="Advisor"
                                                value={advisorName}
                                                onChange={(e) => setAdvisor(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div> 
                    </div>
                </div>
            </div>

            <div className="row btn-row">
                <div className="col-6">
                    <button type="submit" form="my-form" className="btn primary-btn">Confirm Changes</button>
                </div>

                <div className="col-6">
                    <button type="button" className="btn cancel-btn" onClick={handleCancel}>Forget Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditStudent;

// React DOM rendering

const editStudentPage = ReactDOM.createRoot(document.getElementById('EditStudentPage'));
editStudentPage.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/Edit/EditStudent/:studentID" element={<EditStudent />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
