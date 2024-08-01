import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BlobServiceClient } from '@azure/storage-blob';
import { BrowserRouter as Router, Route, Routes, Switch, useParams } from 'react-router-dom';

const EditVisit = () => {
    const {visitID} = useParams(); // Extract visitID from URL parameter
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

    useEffect(() => {
        fetchStudentIDs();
        fetchCounselorIDs();
        fetchTopics();
        if (visitID) {
            fetchVisitDetails(visitID);
        }
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
            setFile(true);
            setFilePath(data.filePath);
            setParentsCalled(data.parentlsCalled);
            setLength(data.length);
            const responseTwo = await fetch(`/api/VisitTopic/`);

            if (!responseTwo.ok) {
                throw new Error('Failed to fetch visit details');
            }
            const dataTwo = await responseTwo.json();
            console.log(data.file+ " and "+ file);
           
            const filteredData = dataTwo.filter(item => item.visitID == visitID);
            
           setSelectedTopics(filteredData.map(item => item.topicID));
            
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
            const response = await fetch(`/api/Visit/UpdateVisit?visitID=${visitID}`, {
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
                <div className="row">
                    <div className="col-md">
                        <label>
                            Student:
                             
                            <select
                                id="studentIDSelectList"
                                value={studentID}
                                onChange={(e) => setStudentID(e.target.value)}
                            />
                        </label>
                         
                        <label>
                            Counselor:
                             
                            <select
                                id="counselorIDSelectList"
                                value={counselorID}
                                onChange={(e) => setCounselorID(e.target.value)}
                            />
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
                        <label>
                            File Uploaded?
                            <input
                                id="fileUploadedCheckbox"
                                type="checkbox"
                                checked={file}
                                onChange={(e) => setFile(e.target.checked)}
                            />
                        </label>
                         
                        <div>
                            {!file ?
                            <><input type="file" onChange={handleFileChange} /><button type="button" onClick={uploadFile}>Upload</button></>
                                :
                                <button type="button" onClick={setFile(false)}>Change File</button>
                                }
                        </div>
                         
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
                                        checked={selectedTopics.includes(topic.topicID)}
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

