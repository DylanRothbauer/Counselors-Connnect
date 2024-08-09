import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Switch, useParams } from 'react-router-dom';

const EditTopic = () => {
    const { topicID } = useParams(); // Extract topicID from URL parameter, same I did for student
    const [topicName, setTopicName] = useState('');

    useEffect(() => {
        if (topicID) {
            fetchTopicDetails(topicID);
        }
    }, [topicID]);

    const fetchTopicDetails = async (topicID) => {
        try {
            const response = await fetch(`/api/Topic/GetTopicById?topicid=${topicID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch topic details');
            }
            const data = await response.json();
            setTopicName(data.topicName);
        } catch (error) {
            console.error('Error fetching topic details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            topicName
        };

        try {
            const response = await fetch(`/api/Topic/UpdateTopic?topicid=${topicID}`, {
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

            // Redirect to topic dashboard
            window.location.href = `/TopicView/TopicView`;

        } catch (error) {
            console.error('Error updating student:', error.message);
            alert("There was an error with updating this student");
        }
    };

    const handleCancel = () => {
        // Navigate back to topics list/dashboard
        window.location.href = '/TopicView/TopicView';
    };

    return (
        <div>
            <h1>Edit Topic</h1>
            <form onSubmit={handleSubmit}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Topic Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Topic name"
                                    value={topicName}
                                    onChange={(e) => setTopicName(e.target.value)}
                                    required
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

export default EditTopic;

// React DOM rendering
const editTopicPage = ReactDOM.createRoot(document.getElementById('EditTopicPage'));
editTopicPage.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/Edit/EditTopic/:topicID" element={<EditTopic />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
