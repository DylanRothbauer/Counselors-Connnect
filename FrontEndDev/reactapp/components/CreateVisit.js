import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BlobServiceClient } from '@azure/storage-blob';

const CreateVisit = () => {
    const [studentID, setStudentID] = useState('');
    const [counselorID, setCounselorID] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(false);
    const [filePath, setFilePath] = useState('');
    const [parentsCalled, setParentsCalled] = useState(false);
    const [length, setLength] = useState('');
    const [fileLoaded, setFileLoaded] = useState(null);
    const [uploadURL, setUploadURL] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    //Initial API calls to get data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await fetchUserName();
                await fetchCounselorIDs(user);
                await fetchStudentIDs();
                await fetchTopics();
            } catch (error) {
                console.error('Error:', error);
                setError(error);
            }
        };

        fetchData();
    }, []);

    //Sets chosen file for upload
    const handleFileChange = (event) => {
        setFileLoaded(event.target.files[0]);
        document.getElementById("display-selection").innerText = event.target.files[0].name
    };

    //Gets logged in username and sets select option to it
    const fetchUserName = async () => {
        try {
            const response = await fetch('/api/Auth/username', {
                method: 'GET',
            });
            const user = await response.json();
            setUserName(user);
            return user;
        } catch (error) {
            console.error('Error:', error);
            setError(error);
        }
    };

    //Gets all counselors for selectlist
    const fetchCounselorIDs = async (userName) => {
        try {
            const response = await fetch('/api/Counselor/', {
                method: 'GET',
            });
            const counselors = await response.json();

            const counselorIDSelectList = document.getElementById('counselorIDSelectList');
            counselorIDSelectList.innerHTML = '';

            const counselorSelectDefault = document.createElement('option');
            counselorSelectDefault.value = '';
            counselorSelectDefault.innerHTML = "Select a Counselor";
            counselorIDSelectList.appendChild(counselorSelectDefault);

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            const result = counselors.sort((a, b) => collator.compare(a.name.split(' ')[1], b.name.split(' ')[1]));

            const currentUser = result.find(counselor => counselor.username === userName);

            if (currentUser) {
                setCounselorID(currentUser.counselorID);
            }

            result.forEach(couns => {
                const option = document.createElement('option');
                option.value = couns.counselorID;
                option.textContent = couns.name;
                counselorIDSelectList.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
            setError(error);
        }
    };

    //Gets all students for selectlist
    const fetchStudentIDs = async () => {
        try {
            const response = await fetch('/api/Student/', {
                method: 'GET',
            });
            const students = await response.json();

            const studentIDSelectList = document.getElementById('studentIDSelectList');
            studentIDSelectList.innerHTML = '';
            const studentSelectDefault = document.createElement('option');
            studentSelectDefault.value = '';
            studentSelectDefault.innerHTML = "Select a Student";
            studentIDSelectList.appendChild(studentSelectDefault);

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            const result = students.sort((a, b) => collator.compare(a.lastName, b.lastName));
            
            result.forEach(stud => {
                const option = document.createElement('option');
                option.value = stud.studentID;
                option.textContent = stud.firstName + ' ' + stud.lastName;
                studentIDSelectList.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    //Gets all topics for checkboxes
    const fetchTopics = async () => {
        try {
            const response = await fetch('/api/Topic/', { method: 'GET' });
            const topics = await response.json();
            setTopics(topics);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    //Submits visit information to visit DB and uses newly created visitID to add selected topics to visitTopic DB
    const handleSubmit = async (event) => {
        event.preventDefault();

        const visit = {
            studentID,
            counselorID,
            date,
            description,
            file,
            filePath,
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
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`Failed to update visit: ${errorText}`);
            }

            //Sets newly created visitID
            const data = await response.json();
            const visitID = data.visitID;

            await Promise.all(
                selectedTopics.map((topicID) =>
                    fetch('/api/VisitTopic', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ visitID, topicID })
                    })
                )
            );

            alert('Visit submitted successfully!');
            window.location.replace("/");
        } catch (error) {
            console.error('Error:', error);
            setError(error);
        }
    };

    //Uploads selected file to blob storage
    const uploadFile = async () => {
        if (!fileLoaded) {
            alert('Please select a file first');
            return;
        }
        //sp = r & st=2024 -08 - 13T20: 44:04Z & se=2024 -08 - 14T04: 44:04Z & sip=20.119.0.25 & spr=https & sv=2022 - 11-02 & sr=c & sig=sC2M % 2BOSq6f22kAEB87ADSjXEivcJObA6yh4O82vcaes % 3D

        const sasToken = 'se=2025-07-17T15%3A01Z&sp=rwdlacup&sv=2022-11-02&ss=b&srt=sco&sig=1XY%2BMeNSlOESK4gQoK/alt3FIIonrk7RhX%2B3u7Jy9XE%3D'; // Your SAS token
        const accountName = 'counselorsconnectstor';
        const containerName = 'counselorsconnectblob';

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net?${sasToken}`
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobName = new Date().getTime() + '-' + fileLoaded.name;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            await blockBlobClient.uploadData(fileLoaded);
            const url = blockBlobClient.url;
            setUploadURL(url);
            alert(`File uploaded successfully! URL: ${url}`);
            setFilePath(url);
            document.getElementById("fileUploadedCheckbox").setAttribute("checked", true)
            setFile(true);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError(error);
            alert('Error uploading file');
        }
    };

    //Sets topics for DB entry
    const handleTopicChange = (topicID) => {
        setSelectedTopics((prevSelected) =>
            prevSelected.includes(topicID)
                ? prevSelected.filter((id) => id !== topicID)
                : [...prevSelected, topicID]
        );
    };

    //Handles cancel button action
    const cancelForm = async () => {
        alert(`Cancelled Visit Entry!`);
        window.location.replace("/");
    }

    //Frontend
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="container visitContainer">
                    <div className="row justify-content-center">
                        <div className="col col-lg-6">
                            <div className="createVisitArea">
                                <div className=" row visitRow">
                                    <div className="col-md-5 visitRow">
                                        <label className="visitLabel">Student:</label>
                                            <select
                                            id="studentIDSelectList"
                                                onChange={(e) => setStudentID(e.target.value)}
                                            />
                                    </div>
                                    <div className="col-md-7">
                                        <label className="visitLabel">Counselor:</label>
                                            <select
                                                id="counselorIDSelectList"
                                                value={counselorID}
                                                onChange={(e) => setCounselorID(e.target.value)}
                                            />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-5">
                                        <label>Topics Discussed:</label>
                                        <div className="topicSelection">
                                            {topics.map(topic => (
                                                <div key={topic.topicID}>
                                                    <label className="col">{topic.topicName}</label>
                                                    <div className="col visitCheckboxes">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTopics.includes(topic.topicID)}
                                                            onChange={() => handleTopicChange(topic.topicID)}
                                                            />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-7 " style={{ marginTop: "20px" }}>
                                        
                                        <label >Parents Contacted?</label>
                                        <div className="visitCheckboxes ">
                                            <input
                                                className="visitCheckbox"
                                                type="checkbox"
                                                onChange={(e) => setParentsCalled(e.target.checked)}
                                            />
                                        </div>

                                        <label>File Uploaded?</label>
                                        <div className=" visitCheckboxes">
                                            <input
                                                id="fileUploadedCheckbox"
                                                type="checkbox"
                                                onChange={(e) => setFile(e.target.checked)}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="createVisitArea">
                                <div className="row visitRow">
                                <div className="col">
                                    <label className="visitLabel">Date:</label>
                                        <input
                                            type="datetime-local"
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row visitRow">
                                <div className="col">
                                    <label className="visitLabel">Length:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="999"
                                            required
                                            style={{ width: '5em' }}
                                            onChange={(e) => setLength(e.target.value)}
                                        />
                                </div>
                                </div>
                                <div className="row visitRow" >
                                <div className="col d-flex align-items-center upload-body">
                                        <button type="button" className="btn primary-btn border border-0">
                                            <label htmlFor='file-upload'>Select File</label>
                                        </button>
                                        <input className="primary-btn d-none" id="file-upload" type="file" style={{ width: '15em' }} onChange={handleFileChange} />
                                        <p id="display-selection" className="m-0 ms-2">No File Selected.</p>
                                </div>
                                </div>
                                <div className="row visitRow justify-content-center">
                                    <div className="col-md-3">
                                        <button className="primary-btn border border-0 mt-3 mb-2" type="button" style={{ margin: 'auto' }} onClick={uploadFile}>Upload</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="createVisitArea ">
                                <label className="visitLabel">Description:</label>
                                    <textarea
                                        rows="10"
                                        required
                                        style={{ width: '100%'} }
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row justify-content-center">
                        <div className="col-md-4" style={{ textAlign: 'center'}}>
                            <button type="submit" className="btn primary-btn" style={{ margin: '5px' }}>Submit</button>
                            <button type="reset" className="btn cancel-btn" style={{ margin: '5px' }} onClick={cancelForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form >          
        </div >
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
