import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Fuse from 'fuse.js';

const TopicsList = () => {
    const [topics, setTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage] = useState(10); // how many topics per page?
    const [maxPageNumbersToShow] = useState(5); // how many pagination buttons at once?
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteTopicId, setDeleteTopicId] = useState(null); // Track topic ID to delete

    useEffect(() => {
        // Fetch topics data
        fetch('/api/Topic')
            .then(response => response.json())
            .then(data => {
                setTopics(data);
            })
            .catch(error => console.error('Error fetching topics:', error));

    }, []);

    // Fuse.js configuration for fuzzy search
    const fuseOptions = {
        keys: ['topicID', 'topicName'],
        includeScore: true,
        threshold: 0.4,
    };

    const fuse = new Fuse(topics, fuseOptions);

    // Function to perform fuzzy search and update filtered topics
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredTopics(topics);
        } else {
            const results = fuse.search(searchTerm);
            const filteredTopics = results.map(result => result.item);
            setFilteredTopics(filteredTopics);
        }
        setCurrentPage(1); 
    }, [searchTerm, topics]);

    const [filteredTopics, setFilteredTopics] = useState(topics);

    // Pagination logic
    const indexOfLastTopic = currentPage * topicsPerPage;
    const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
    const currentTopics = filteredTopics.slice(indexOfFirstTopic, indexOfLastTopic);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination related functions and variables
    const pageNumbers = Math.ceil(filteredTopics.length / topicsPerPage);

    // Determine the range of page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(pageNumbers, startPage + maxPageNumbersToShow - 1);

    // Function to handle edit button click
    const handleEditButtonClick = (topicID) => {
        // Redirect to the edit page
        window.location.href = `/Edit/EditTopic/${topicID}`;
    };

    // Function to handle delete confirmation
    const handleDeleteConfirmation = (topicID) => {
        setDeleteTopicId(topicID);
        if (window.confirm(`Are you sure you want to delete topic ${topicID}?`)) {
            deleteTopic(topicID);
        }
    };

    // Function to delete topic via DELETE request
    const deleteTopic = (topicID) => {
        fetch(`/api/Topic/DeleteTopic?topicid=${topicID}`, {
            method: "Delete",
            body: { topicid: topicID }
        }).then(() => {
            window.location.reload();
        }).catch((err) => {
            console.log(err.message)
        });
    };

    return (
        <div>
            <h1>Topics</h1>
            <p>
                <a href="/Create/CreateATopic">Create New</a>
            </p>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredTopics.length === 0 ? (
                <div className="alert alert-info">No results found.</div> // If no results, display div, otherwise continue with table :)
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Topic ID</th>
                                <th>Topic Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTopics.map(topic => (
                                <tr key={topic.topicID}>
                                    <td>{topic.topicID}</td>
                                    <td>{topic.topicName}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleEditButtonClick(topic.topicID)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(topic.topicID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="pagination-container">
                        <span>Page {currentPage} of {pageNumbers}</span>
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
                                        &laquo;
                                    </a>
                                </li>
                                {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                                            {number}
                                        </a>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
                                    <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
                                        &raquo;
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicsList;

// React DOM rendering
const topic = ReactDOM.createRoot(document.getElementById('topics'));
topic.render(
    <React.StrictMode>
        <TopicsList />
    </React.StrictMode>
);
