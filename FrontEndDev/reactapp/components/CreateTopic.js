import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const CreateTopic = () => {
    const [topicName, setTopicName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            topicName
        };

        try {
            const response = await fetch('/api/Topic', {

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
                window.location.replace("/TopicView/TopicView");

            } catch (exception) {
                throw new Error(exception);
            }

        }
        catch (error) {
            console.error('Error:', error.message);
            // Display error message to the user, e.g., show an alert
            alert("There was an error with inserting this topic");
        }
    };



    const handleCancel = () => {
        // Navigate back to topics list
        window.location.href = '/TopicView/TopicView';
    };

    return (
        <div>
            <h1>Create Topic</h1>
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

export default CreateTopic;

// React DOM rendering
const createStudentPage = ReactDOM.createRoot(document.getElementById('CreateTopicPage'));
createStudentPage.render(
    <React.StrictMode>
        <CreateTopic />
    </React.StrictMode>
);
