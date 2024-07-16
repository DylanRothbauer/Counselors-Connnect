import React, { useState, useEffect } from 'react';

const Visits = () => {
    const [visits, setVisits] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetch('/api/visits')
            .then(response => response.json())
            .then(data => {
                setVisits(data);
                setFilteredVisits(data);
            })
            .catch(error => console.error('Error fetching visits:', error));
    }, []);

    const handleFilterChange = (event) => {
        const keyword = event.target.value.toLowerCase();
        setFilter(keyword);

        const filtered = visits.filter(visit =>
            visit.id.toString().toLowerCase().includes(keyword) ||
            visit.studentId.toString().toLowerCase().includes(keyword) ||
            visit.counselorId.toString().toLowerCase().includes(keyword) ||
            //visit.date.toString().toLowerCase().includes(keyword) ||
            visit.description.toString().toLowerCase().includes(keyword) ||
            //visit.file.toString().toLowerCase().includes(keyword) ||
            //visit.parentsCalled.toString().toLowerCase().includes(keyword) ||
            visit.length.toString().toLowerCase().includes(keyword)
            //visit.topics.toString().toLowerCase().includes(keyword)
        );

        setFilteredVisits(filtered);
    };

    const handleEditClick = (id) => {
        // Navigate to the edit view for the specific todo item
        window.location.href = `/Views/Visits/Edit/${id}`;
    };

    const handleDetailsClick = (id) => {
        window.location.href = `/Views/Visits/Details/${id}`;
    };

    const handleDeleteClick = (id) => {
        window.location.href = `/Views/Visits/Delete/${id}`;
    };

    const handleCreateClick = () => {
        window.location.href = `/Views/Visits/Create`;
    };

    return (
        <div>
            <h1>Todo List</h1>
            <a href="#" onClick={() => handleCreateClick()}>Create New</a>
            <div>
                <h2>Filter</h2>
                <input
                    type="text"
                    placeholder="Filter visits"
                    value={filter}
                    onChange={handleFilterChange}
                />
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Visit ID</th>
                            <th>Student ID</th>
                            <th>Counselor ID</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>File</th>
                            <th>Parents Called</th>
                            <th>Length</th>
                            <th>Topics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisits.map(visit => (
                            <tr key={visit.id}>
                                <td>{visit.id}</td>
                                <td>{visit.studentId}</td>
                                <td>{visit.counselorId}</td>
                                <td>{new Date(visit.date).toLocaleDateString()}</td>
                                <td>{visit.description}</td>
                                <td>{visit.file}</td>
                                <td>{visit.parentsCalled}</td>
                                <td>{visit.length}</td>
                                <td>{visit.topics}</td>

                                <td>
                                    {/*<a href="/Items/Edit/">Edit</a>*/}
                                    <a href="#" onClick={() => handleEditClick(visit.id)}>Edit</a> |
                                    <a href="#" onClick={() => handleDetailsClick(visit.id)}>Details</a> |
                                    <a href="#" onClick={() => handleDeleteClick(visit.id)}>Delete</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Visits;
