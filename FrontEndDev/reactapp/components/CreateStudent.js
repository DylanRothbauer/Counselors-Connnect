import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const CreateStudent = () => {
    const [studentID, setStudentID] = useState(''); // State for student ID
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [grade, setGradeLevel] = useState('');
    const [advisorName, setAdvisor] = useState('');

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
            const response = await fetch('/api/Student', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            var json;

            try {

                if (!response.ok) {
                    json = await response.json();
                    throw json.message ?? json.Message;
                }
                var data = await response.json();
                console.log('Success:', data);
                window.location.replace("/StudentView/StudentView"); // Redirect to Student Page

            } catch (exception) {
                throw new Error(exception);
            }
       
        }
        catch (error) {
            console.error('Error:', error.message);
            // Display error message to the user, e.g., show an alert
            alert("There was an error with inserting this student");
        }
    };



    const handleCancel = () => {
        // Navigate back to students list
        window.location.href = '/StudentView/StudentView';
    };

    return (
        <div className="container m-auto create-student-component">
            <div className="row">
                <div className="col my-3">
                    <div id="student-table-container">
                        <div className="student-table p-3">
                            <form id="create-form" onSubmit={handleSubmit}>
                                <div className="row align-items-end">
                                    <div className="col">
                                        <div className="row">
                                            <p>Student ID:</p>
                                        </div>
                                        <div className="row">
                                            <input id="inputs"
                                                type="text"
                                                placeholder="Student ID"
                                                value={studentID}
                                                onChange={(e) => setStudentID(e.target.value)}
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
                    <button type="submit" form="create-form" className="btn primary-btn">Submit</button>
                </div>

                <div className="col-6">
                    <button type="button" className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            
        </div>
    );
};

export default CreateStudent;

// React DOM rendering
const createStudentPage = ReactDOM.createRoot(document.getElementById('CreateStudentPage'));
createStudentPage.render(
    <React.StrictMode>
        <CreateStudent />
    </React.StrictMode>
);
