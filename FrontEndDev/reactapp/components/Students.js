import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Fuse from 'fuse.js';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10); // how many students per page?
    const [maxPageNumbersToShow] = useState(5); // how many pagination buttons at once?
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteStudentId, setDeleteStudentId] = useState(null); // Track student ID to delete

    useEffect(() => {
        // Fetch students data
        fetch('/api/Student')
            .then(response => response.json())
            .then(data => {
                setStudents(data);
            })
            .catch(error => console.error('Error fetching students:', error));

    }, []);

    // Filtered students based on search term (manual)
    //const filteredStudents = students.filter(student =>
    //    `${student.firstName} ${student.lastName} ${student.studentID} ${student.grade} ${student.advisorName}`
    //        .toLowerCase()
    //        .includes(searchTerm.toLowerCase())
    //);

    // Fuse.js configuration for fuzzy search
    const fuseOptions = {
        keys: ['firstName', 'lastName', 'studentID', 'grade', 'advisorName'],
        includeScore: true,
        threshold: 0.4,
    };

    const fuse = new Fuse(students, fuseOptions);

    // Function to perform fuzzy search and update filtered students
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const results = fuse.search(searchTerm);
            const filteredStudents = results.map(result => result.item);
            setFilteredStudents(filteredStudents);
        }
        setCurrentPage(1); // Reset to first page after search
    }, [searchTerm, students]); // Dependencies that will execute the effect when either one changes?

    const [filteredStudents, setFilteredStudents] = useState(students);

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination related functions and variables
    const pageNumbers = Math.ceil(filteredStudents.length / studentsPerPage);

    // Determine the range of page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(pageNumbers, startPage + maxPageNumbersToShow - 1);

    // Function to handle edit button click
    const handleEditButtonClick = (studentID) => {
        // Redirect to the edit page
        window.location.href = `/Edit/EditStudent/${studentID}`;
    };

    // Function to handle delete confirmation
    const handleDeleteConfirmation = (studentID) => {
        setDeleteStudentId(studentID);
        if (window.confirm(`Are you sure you want to delete student ${studentID}?`)) {
            deleteStudent(studentID);
        }
    };

    // Function to delete student via DELETE request
    const deleteStudent = (studentID) => {
        fetch(`/api/Student/Delete?studentid=${studentID}`, {
            method: "Delete",
            body: { studentid: studentID }
        }).then(() => {
            window.location.reload();
        }).catch((err) => {
            console.log(err.message)
        });
    };

    return (
        <div>
            <h1>Students</h1>
            <p>
                <a href="/students/create">Create New</a>
            </p>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredStudents.length === 0 ? (
                <div className="alert alert-info">No results found.</div> // If no results, display div, otherwise continue with table :)
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Advisor</th>
                                <th>ID #</th>
                                <th>Grade Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map(student => (
                                <tr key={student.studentID}>
                                    <td>{student.lastName}, {student.firstName}</td>
                                    <td>{student.advisorName}</td>
                                    <td>{student.studentID}</td>
                                    <td>{student.grade}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleEditButtonClick(student.studentID)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(student.studentID)}>Delete</button>
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

export default StudentsList;

// React DOM rendering
const student = ReactDOM.createRoot(document.getElementById('students'));
student.render(
    <React.StrictMode>
        <StudentsList />
    </React.StrictMode>
);
