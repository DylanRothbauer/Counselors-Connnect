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
        <div className="container m-auto create-topic-component">
            <div className="row">
                <div className="col my-3">
                    <div id="topic-table-container">
                        <div className="topic-table p-3">
                            <form id="create-form" onSubmit={handleSubmit}>
                                <div className="row align-items-end">
                                    <div className="col">
                                        <div className="row">
                                            <p>Topic Name:</p>
                                        </div>
                                        <div className="row">
                                            <input id="inputs"
                                                type="text"
                                                placeholder="Topic name"
                                                value={topicName}
                                                onChange={(e) => setTopicName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row btn-row">
                <div className="col-6">
                    <button type="submit" form="create-form" className="btn primary-btn">Submit</button>
                </div>

                <div className="col-6">
                    <button type="button" className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </div>

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
