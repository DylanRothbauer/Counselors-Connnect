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

    const handleFileChange = (event) => {
        setFileLoaded(event.target.files[0]);
    };

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

    const fetchCounselorIDs = async (userName) => {
        try {
            const response = await fetch('/api/Counselor/', {
                method: 'GET',
            });
            const counselors = await response.json();

            const counselorIDSelectList = document.getElementById('counselorIDSelectList');
            counselorIDSelectList.innerHTML = '';

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

    const fetchStudentIDs = async () => {
        try {
            const response = await fetch('/api/Student/', {
                method: 'GET',
            });
            const students = await response.json();

            const studentIDSelectList = document.getElementById('studentIDSelectList');
            studentIDSelectList.innerHTML = '';

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            const result = students.sort((a, b) => collator.compare(a.lastName, b.lastName));
            setStudentID(result[0].studentID);
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
                throw new Error('Network response was not ok');
            }

           
            
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

    const uploadFile = async () => {
        if (!fileLoaded) {
            alert('Please select a file first');
            return;
        }

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

    const handleTopicChange = (topicID) => {
        setSelectedTopics((prevSelected) =>
            prevSelected.includes(topicID)
                ? prevSelected.filter((id) => id !== topicID)
                : [...prevSelected, topicID]
        );
    };

    const cancelForm = async () => {
        alert(`Cancelled Visit Entry!`);
        window.location.replace("/");
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="container" style={{marginTop:'50px'}}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div class="createVisitArea">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>
                                            Student:
                                            <br />
                                            <select
                                                id="studentIDSelectList"
                                                onChange={(e) => setStudentID(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <br />
                                        <label>
                                            Parents Contacted?
                                            <input
                                                className="visitCheckbox"
                                                type="checkbox"
                                                onChange={(e) => setParentsCalled(e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>
                                            Counselor:
                                            <br />
                                            <select
                                                id="counselorIDSelectList"
                                                value={counselorID}
                                                onChange={(e) => setCounselorID(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <br />
                                        <label>
                                            File Uploaded?
                                            <input
                                                id="fileUploadedCheckbox"
                                                type="checkbox"
                                                onChange={(e) => setFile(e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Topics Discussed:</label>
                                        <br />
                                        <div className="topicSelection">
                                            {topics.map(topic => (
                                                <div key={topic.topicID}>
                                                    <label>
                                                        {topic.topicName}
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTopics.includes(topic.topicID)}
                                                            onChange={() => handleTopicChange(topic.topicID)}
                                                        />
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="createVisitArea ">
                                <div className="row">
                                    <label>
                                        Date:
                                        <br />
                                        <input
                                            type="datetime-local"
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                                <br />
                                <div className="row">
                                    <label>
                                        Length:
                                        <br />
                                        <input
                                            type="number"
                                            min="1"
                                            max="999"
                                            required
                                            style={{ width: '7em' }}
                                            onChange={(e) => setLength(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <br />
                                <div className="row" >
                                    <label>
                                        Upload a File:
                                        <br />
                                        <input type="file" style={{width: '15em'}} onChange={handleFileChange} />
                                    </label>
                                </div>
                                <br />
                                <div className="row justify-content-center">
                                    <div className="col-md-3">
                                        <button type="button" style={{ margin: 'auto' }} onClick={uploadFile}>Upload</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="createVisitArea ">
                                <label>
                                    Description:
                                    <br />
                                </label>
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
                            <button type="submit" class="btn primary-btn" style={{margin:'5px'}}>Submit</button>
                            <button type="reset" class="btn cancel-btn" style={{ margin: '5px' }} onClick={cancelForm}>Cancel</button>

                        </div>
                      
                        

                    </div>
                </div>








            </form >
            {error && <p className="error">Error: {error.message}</p>}
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
