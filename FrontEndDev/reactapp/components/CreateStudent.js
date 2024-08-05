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
        <div>
            <h1>Create Student</h1>
            <form onSubmit={handleSubmit}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Grade Level</th>
                            <th>Advisor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Student ID"
                                    value={studentID}
                                    onChange={(e) => setStudentID(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    placeholder="Grade level"
                                    value={grade}
                                    onChange={(e) => setGradeLevel(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Advisor"
                                    value={advisorName}
                                    onChange={(e) => setAdvisor(e.target.value)}
                                />
                            </td>
                            <td>
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
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
