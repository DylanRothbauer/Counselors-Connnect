import React, { useState, useEffect } from 'react';

const Visits = () => {
    const [visits, setVisits] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterFile, setFilterFile] = useState(false);
    const [filterParentsCalled, setFilterParentsCalled] = useState(false);
    const [filterTopics, setFilterTopics] = useState([]);
    const [calendarDate, setCalendarDate] = useState('');

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

        filterVisits(keyword, filterFile, filterParentsCalled, filterTopics, calendarDate);
    };

    const handleFileFilterChange = (event) => {
        const isChecked = event.target.checked;
        setFilterFile(isChecked);

        filterVisits(filter, isChecked, filterParentsCalled, filterTopics, calendarDate);
    };

    const handleParentsCalledFilterChange = (event) => {
        const isChecked = event.target.checked;
        setFilterParentsCalled(isChecked);

        filterVisits(filter, filterFile, isChecked, filterTopics, calendarDate);
    };

    const handleCalendarChange = (event) => {
        const selectedDate = event.target.value;
        setCalendarDate(selectedDate);

        filterVisits(filter, filterFile, filterParentsCalled, filterTopics, selectedDate);
    };

    const filterVisits = (keyword, file, parentsCalled, topics, date) => {
        const filtered = visits.filter(visit =>
            visit.visitID.toString().toLowerCase().includes(keyword) ||
            visit.studentID.toString().toLowerCase().includes(keyword) ||
            visit.counselorID.toString().toLowerCase().includes(keyword) ||
            visit.date.toLowerCase().includes(keyword) ||
            visit.description.toLowerCase().includes(keyword) ||
            (!file || visit.file) &&
            (!parentsCalled || visit.parentsCalled) &&
            (date === '' || visit.date === date)
        );

        setFilteredVisits(filtered);
    };

    const handleEditClick = (id) => {
        window.location.href = `/Views/Visits/Edit/${id}`;
    };

    const handleDetailsClick = (id) => {
        window.location.href = `/Views/Visits/Details/${id}`;
    };

    const handleDeleteClick = (id) => {
        window.location.href = `/Views/Visits/Delete/${id}`;
    };

    //const handleCreateClick = () => {
    //    window.location.href = `/Views/Visits/Create`;
    //};

    return (
        <div>
            <h1>Visits</h1>
            {/*<a href="#" onClick={handleCreateClick}>Create New</a>*/}
            <div>
                {/*<h2>Filter</h2>*/}
                <input
                    type="text"
                    placeholder="Search visits"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <label>
                    Date:
                    <input
                        type="date"
                        value={calendarDate}
                        onChange={handleCalendarChange}
                    />
                </label>
                <label>
                    File:
                    <input
                        type="checkbox"
                        checked={filterFile}
                        onChange={handleFileFilterChange}
                    />
                </label>
                <label>
                    Parents Called:
                    <input
                        type="checkbox"
                        checked={filterParentsCalled}
                        onChange={handleParentsCalledFilterChange}
                    />
                </label>
                <div>
                    Topics:
              
                </div>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisits.map(visit => (
                            <tr key={visit.visitID}>
                                <td>{visit.visitID}</td>
                                <td>{visit.studentID}</td>
                                <td>{visit.counselorID}</td>
                                <td>{new Date(visit.date).toLocaleDateString()}</td>
                                <td>{visit.description}</td>
                                <td>{visit.file ? 'Yes' : 'No'}</td>
                                <td>{visit.parentsCalled ? 'Yes' : 'No'}</td>
                                <td>{visit.length}</td>
                                <td>{visit.topics ? visit.topics.join(', ') : ''}</td>
                                <td>
                                    <a href="#" onClick={() => handleEditClick(visit.visitID)}>Edit</a> |
                                    <a href="#" onClick={() => handleDetailsClick(visit.visitID)}>Details</a> |
                                    <a href="#" onClick={() => handleDeleteClick(visit.visitID)}>Delete</a>
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
