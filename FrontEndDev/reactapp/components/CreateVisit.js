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
    
    useEffect(() => {
        fetchStudentIDs();
        fetchCounselorIDs();
        fetchTopics();
    }, []);

    const handleFileChange = (event) => {
        setFileLoaded(event.target.files[0]);
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

            const data = await response.json();
            console.log('success', data);
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
        }  
        
    };

    async function fetchStudentIDs() {
        try {
            const response = await fetch('/api/Student/', {
                method: 'GET',
            });
            var students = await response.json();

            var studentListLength = studentIDSelectList.options.length - 1
            for (var i = studentListLength; i >= 0; i--) {
                studentIDSelectList.remove(i);
            }

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            let result = students.sort((a, b) => collator.compare(a.lastName, b.lastName));

            result.forEach(stud => {
                const option = document.createElement('option');
                option.value = stud.studentID;
                option.textContent = stud.firstName + ' ' + stud.lastName;
                studentIDSelectList.appendChild(option)
            })
        }
        catch (error) {
            console.error(error);
        }
    };

    async function fetchCounselorIDs() {
        try {
            const response = await fetch('/api/Counselor/', {
                method: 'GET',
            });
            var counselors = await response.json();

            var counselorListLength = counselorIDSelectList.options.length - 1
            for (var i = counselorListLength; i >= 0; i--) {
                counselorIDSelectList.remove(i);
            }

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            let result = counselors.sort((a, b) => collator.compare(a.name.split(' ')[1], b.name.split(' ')[1]));

            result.forEach(couns => {
                const option = document.createElement('option');
                option.value = couns.counselorID;
                option.textContent = couns.name;
                counselorIDSelectList.appendChild(option)
            })
        }
        catch (error) {
            console.error(error);
        }
    };

    const fetchTopics = async () => {
        try {
            const response = await fetch('/api/Topic/', { method: 'GET' });
            const topics = await response.json();
            setTopics(topics);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div class="row">
                    <div class="col-md">
                        <label>
                            Student:
                            <br />
                            <select
                                id="studentIDSelectList"
                                onChange={(e) => setStudentID(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Counselor:
                            <br />
                            <select
                                id="counselorIDSelectList"
                                onChange={(e) => setCounselorID(e.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div class="col-md">
                        <label>
                            Date:
                            <br />
                            <input
                                type="datetime-local"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Length:
                            <br />
                            <input
                                type="number"
                                onChange={(e) => setLength(e.target.value)}
                            />
                        </label>
                        <br />
                    </div>
                    <div class="col-md">
                        <label>
                            File Uploaded? 
                            <input
                                id="fileUploadedCheckbox"
                                type="checkbox"
                                onChange={(e) => setFile(e.target.checked)}
                            />
                        </label>
                        <br />
                        <div>
                            <input type="file" onChange={handleFileChange} />
                            <button type="button" onClick={uploadFile}>Upload</button>

                        </div>
                        <br />
                    </div>
                    <div class="col-md">
                        <label>
                            Parents Contacted?
                            <input
                                type="checkbox"
                                onChange={(e) => setParentsCalled(e.target.checked)}
                            />
                        </label>
                        <br />
                        
                    </div>
                </div>
                <div class="row">
                <div class="col-md">
                <label>
                    Description:
                    <br />
                    <textarea
                        rows="10"
                        cols="50"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                        <br />
                    </div>
                    <div className="col-md">
                        <label>Topics Discussed:</label>
                        <br />
                        {topics.map(topic => (
                            <div key={topic.topicID}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(topic.topicID)}
                                        onChange={() => handleTopicChange(topic.topicID)}
                                    />
                                    {topic.topicName}
                                </label>
                            </div>
                        ))}
                        <br />
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};





// React DOM rendering
const createVisitForm = ReactDOM.createRoot(document.getElementById('CreateVisitForm'));
createVisitForm.render(
    <React.StrictMode>
        <CreateVisit />
    </React.StrictMode>
);

export default CreateVisit;
