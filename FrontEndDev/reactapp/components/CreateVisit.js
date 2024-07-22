import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const CreateVisit = () => {
    const [studentID, setStudentID] = useState('');
    const [counselorID, setCounselorID] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(false);
    const [parentsCalled, setParentsCalled] = useState(false);
    const [length, setLength] = useState('');
    //const [topicID, setTopicID] = useState('');

    async function fetchStudentIDs() {
        try {
            const response = await fetch('/api/Students/', {
                method: 'GET',
            });
            const students = await response.json();
            const studentIDs = students.StudentID;
            return studentIDs;
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const visit = {
            studentID,
            counselorID,
            date,
            description,
            file,//: file, ? new URL(file) : null, // Ensure the file is converted to a URL object if provided
            parentsCalled,
            length
            
        };

        try {
            const response = await fetch('/api/Visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visit)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            window.location.replace("/");
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    return (
       
        <div>
            <h1>Add Visit</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Student:
                    <input
                        type="number"
                        onChange={(e) => setStudentID(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Counselor:
                    <input
                        type="number"
                        onChange={(e) => setCounselorID(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <input
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Date:
                    <input
                        type="datetime-local"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    File Uploaded?
                    <input
                        type="checkbox"
                        onChange={(e) => setFile(e.target.checked)}      
                    />
                </label>            
                <br />
                <label>
                    Parents Contacted?
                    <input
                        type="checkbox"
                        onChange={(e) => setParentsCalled(e.target.checked)}                            
                />
                </label>
                <br />
                <label>
                    Length:
                    <input
                        type="number"
                        onChange={(e) => setLength(e.target.value)}
                    />
                </label>
                <br />

                <button type="submit">Submit</button>
            </form>
            </div>
        
    );
};


export default CreateVisit;



// React DOM rendering
const createVisitForm = ReactDOM.createRoot(document.getElementById('CreateVisitForm'));
createVisitForm.render(
    <React.StrictMode>
        <CreateVisit />
    </React.StrictMode>
);
    