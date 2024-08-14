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
        document.getElementById("display-selection").innerText = event.target.files[0].name
    };

    const uploadFile = async () => {
        if (!fileLoaded) {
            alert('Please select a file first');
            return;
        }

        const sasToken = 'sp=racwdli&st=2024-08-14T16:49:38Z&se=2026-06-17T00:49:38Z&sip=20.119.0.25&spr=https&sv=2022-11-02&sr=c&sig=jJChyDaUX8H7HVmKfBxulG2i19PpQjdb62IF9%2Bdbeto%3D'; // Your SAS token
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

            const studentSelectDefault = document.createElement('option');
            studentSelectDefault.value = '';
            studentSelectDefault.innerHTML = "Select a Student";
            studentIDSelectList.appendChild(studentSelectDefault);

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

            const counselorSelectDefault = document.createElement('option');
            counselorSelectDefault.value = '';
            counselorSelectDefault.innerHTML = "Select a Counselor";
            counselorIDSelectList.appendChild(counselorSelectDefault);

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

    const cancelForm = async () => {
        alert(`Cancelled Visit Entry!`);
        window.location.replace("/");
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="container visitContainer">
                    <div className="row justify-content-center">
                        <div className="col col-lg-6">
                            <div class="createVisitArea">
                                <div className=" row visitRow">
                                    <div className="col-md-5 visitRow">
                                        <label className="visitLabel">Student:</label>
                                        <select
                                            id="studentIDSelectList"
                                            value={studentID}
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
                                        <label className="visitLabel">Topics Discussed:</label>
                                        <div className="topicSelection">
                                            {topics.map(topic => (
                                                <div key={topic.topicID}>
                                                    <label className="col">{topic.topicName}</label>
                                                    <div className="col visitCheckboxes">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={(selectedTopics.find(item => item == topic.topicID) ? true : false)}
                                                            onChange={() => handleTopicChange(topic.topicID)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <label visitLabel>Parents Contacted?</label>
                                        <div className="visitCheckboxes">
                                            <input
                                                className="visitCheckbox"
                                                type="checkbox"
                                                checked={parentsCalled}
                                                onChange={(e) => setParentsCalled(e.target.checked)}
                                            />
                                        </div>
                                        <label>File Uploaded?</label>
                                        <div className=" visitCheckboxes">
                                            <input
                                                id="fileUploadedCheckbox"
                                                type="checkbox"
                                                checked={file}
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
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
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
                                            value={length}
                                            style={{ width: '5em' }}
                                            onChange={(e) => setLength(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row visitRow">
                                    <div className="col">
                                        {!file ? (
                                            <div className="col visitRow d-flex align-items-center upload-body">
                                                <button type="button" className="btn primary-btn border border-0">
                                                    <label htmlFor='file-upload'>Select File</label>
                                                </button>
                                                <input className="primary-btn d-none" id="file-upload" type="file" style={{ width: '15em' }} onChange={handleFileChange} />
                                                <p id="display-selection" className="m-0 ms-2">No File Selected.</p>
                                            </div>
                                        ) : (

                                            <div className="col visitRow d-flex align-items-center upload-body">
                                                <button type="button" className="btn primary-btn border border-0" onClick={() => setFile(false)}>
                                                    <label htmlFor='file-upload'>Change File</label>
                                                </button>
                                                <input className="primary-btn d-none" id="file-upload" type="file" style={{ width: '15em' }} onChange={handleFileChange} />
                                                    <p id="display-selection" className="m-0 ms-2"></p>
                                            </div>

                                        )}
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-md-3">
                                            <button className="primary-btn border border-0 mt-3 mb-2" type="button" style={{ margin: 'auto' }} onClick={uploadFile}>Upload</button>
                                        </div>
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
                                    style={{ width: '100%' }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row justify-content-center">
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <button type="submit" class="btn primary-btn" style={{ margin: '5px' }}>Submit</button>
                            <button type="reset" class="btn cancel-btn" style={{ margin: '5px' }} onClick={cancelForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form >
            {error && <p className="error">Error: {error.message}</p>}
        </div >
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
