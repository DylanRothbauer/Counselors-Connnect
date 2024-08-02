import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BlobServiceClient } from '@azure/storage-blob';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';

const EditVisit = () => {
    const { visitID } = useParams(); // Extract visitID from URL parameter
    const [counselorID, setCounselorID] = useState('');
    const [studentID, setStudentID] = useState('');
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
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
             
                    const topic = await fetchVisitDetails(visitID);
             
                await setSelectedTopics(topic.map(item => item.topicID));
                await fetchCounselorIDs();
                await fetchStudentIDs();
                await fetchTopics();
            } catch (error) {
                console.error('Error:', error);
                setError(error);
            }
        };

        fetchData();
    }, [visitID]);

    const fetchVisitDetails = async (visitID) => {
        try {
            const response = await fetch(`/api/Visit/GetVisitById?visitid=${visitID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch visit details');
            }
            const data = await response.json();
            setStudentID(data.studentID);
            setCounselorID(data.counselorID);
            setDate(data.date);
            setDescription(data.description);
            setFile(data.file);
            setFilePath(data.filePath);
            setParentsCalled(data.parentsCalled);
            setLength(data.length);
            const responseTwo = await fetch(`/api/VisitTopic/`);

            if (!responseTwo.ok) {
                throw new Error('Failed to fetch visit details');
            }
            const dataTwo = await responseTwo.json();
           
            const filteredData = dataTwo.filter(item => item.visitID == visitID);
            
            
            return filteredData;
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

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
        console.log(selectedTopics);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
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
            const response = await fetch(`/api/Visit/UpdateVisit?visitid=${visitID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                console.error('Response error:', errorText);
                throw new Error(`Failed to update visit: ${errorText}`);
            }

            

            // Create an array of visitTopics
            const visitTopics = selectedTopics.map(topicID => ({
                visitID,
                topicID
            }));

            // Send visitTopics to the UpdateVisitTopic endpoint
            const visitTopicResponse = await fetch(`/api/VisitTopic/UpdateVisitTopic?visitid=${visitID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitTopics)
            });

            if (!visitTopicResponse.ok) {
                const visitTopicErrorText = await visitTopicResponse.text();
                console.error('VisitTopic update error:', visitTopicErrorText);
                throw new Error(`Failed to update visit topics: ${visitTopicErrorText}`);
            }

            const visitTopicData = await visitTopicResponse.json();
            console.log('VisitTopic update success:', visitTopicData);

            
            alert('Visit submitted successfully!');
            window.location.replace("/");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStudentIDs = async () => {
        try {
            const response = await fetch('/api/Student/', { method: 'GET' });
            const students = await response.json();

            const studentIDSelectList = document.getElementById('studentIDSelectList');
            const studentListLength = studentIDSelectList.options.length - 1;
            for (let i = studentListLength; i >= 0; i--) {
                studentIDSelectList.remove(i);
            }

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            const result = students.sort((a, b) => collator.compare(a.lastName, b.lastName));

            result.forEach(stud => {
                const option = document.createElement('option');
                option.value = stud.studentID;
                option.textContent = `${stud.firstName} ${stud.lastName}`;
                studentIDSelectList.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCounselorIDs = async () => {
        try {
            const response = await fetch('/api/Counselor/', { method: 'GET' });
            const counselors = await response.json();

            const counselorIDSelectList = document.getElementById('counselorIDSelectList');
            const counselorListLength = counselorIDSelectList.options.length - 1;
            for (let i = counselorListLength; i >= 0; i--) {
                counselorIDSelectList.remove(i);
            }

            const collator = new Intl.Collator('en', { sensitivity: 'base' });
            const result = counselors.sort((a, b) => collator.compare(a.name.split(' ')[1], b.name.split(' ')[1]));

            result.forEach(couns => {
                const option = document.createElement('option');
                option.value = couns.counselorID;
                option.textContent = couns.name;
                counselorIDSelectList.appendChild(option);
            });
        } catch (error) {
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
                <div className="row">
                    <div className="col-md">
                        <label>
                            Student:
                            <select
                                id="studentIDSelectList"
                                value={studentID}
                                onChange={(e) => setStudentID(e.target.value)}
                            >
                                <option value="">Select a student</option>
                            </select>
                        </label>
                    </div>
                    <div className="col-md">
                        <label>
                            Counselor:
                            <select
                                id="counselorIDSelectList"
                                value={counselorID}
                                onChange={(e) => setCounselorID(e.target.value)}
                            >
                                <option value="">Select a counselor</option>
                            </select>
                        </label>
                    </div>
                    <div className="col-md">
                        <label>
                            Date:
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Length:
                            <input
                                type="number"
                                min="1"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="col-md">
                        {!file ? (
                            <>
                                <div>
                                    <input type="file" onChange={handleFileChange} />
                                    <button type="button" onClick={uploadFile}>Upload</button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <button type="button" onClick={() => setFile(false)}>Change File</button>
                            </div>
                        )}
                    </div>
                    <div className="col-md">
                        <label>
                            Parents Contacted?
                            <input
                                type="checkbox"
                                checked={parentsCalled}
                                onChange={(e) => setParentsCalled(e.target.checked)}
                            />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md">
                        <label>
                            Description:
                            <textarea
                                rows="10"
                                cols="50"
                                min="1"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="col-md">
                        <label>Topics Discussed:</label>
                        {topics.map(topic => (
                            <div key={topic.topicID}>
                                <label>
                                    <input
                                        type="checkbox"
                                        defaultChecked={(selectedTopics.find(item => item == topic.topicID)? true : false)}
                                       
                                        onChange={() => handleTopicChange(topic.topicID)}
                                    />
                                    {topic.topicName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
            {error && <p className="error">Error: {error.message}</p>}
        </div>
    );
};

export default EditVisit;

// React DOM rendering
const EditVisitForm = ReactDOM.createRoot(document.getElementById('EditVisitForm'));
EditVisitForm.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/Edit/EditVisit/:visitID" element={<EditVisit />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
