import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Fuse from 'fuse.js';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10); // how many students per page?
    const [maxPageNumbersToShow] = useState(5); // how many pagination buttons at once?
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteStudentId, setDeleteStudentId] = useState(null); // Track student ID to delete
    const [message, setMessage] = useState('');

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

    // Create a Fuse instance with students data and fuseOptions
    const fuse = new Fuse(students, fuseOptions);

    // Function to perform fuzzy search
    const performSearch = (value) => {
        const results = fuse.search(value);
        const filteredStudents = results.map(result => result.item);
        return filteredStudents;
    };

    // Filtered students based on search term
    const filteredStudents = searchTerm ? performSearch(searchTerm) : students;


    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Get the page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(students.length / studentsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Determine the range of page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(pageNumbers.length, startPage + maxPageNumbersToShow - 1);

    // Function to handle edit button click
    const handleEditButtonClick = (studentID) => {
        // Redirect to the edit page or handle edit functionality as needed
        window.location.href = `/Edit/EditStudent/${studentID}`;
    };

    // Function to handle delete confirmation
    const handleDeleteConfirmation = (studentID) => {
        setDeleteStudentId(studentID);
        // You can show a confirmation modal here if you have one
        if (window.confirm(`Are you sure you want to delete student ${studentID}?`)) {
            // Perform delete operation
            deleteStudent(studentID);
        }
    };

    // Function to delete student via POST request
    const deleteStudent = (studentID) => {
        fetch(`/api/Student/Delete?studentid=${studentID}`,
            {
                method: "Delete",
                body: {studentid: studentID}
            }).then(() => {
                window.location.reload();
            }).catch((err) => {
                console.log(err.message)
            })

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
                <span>Page {currentPage} of {pageNumbers.length}</span>
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
                                &laquo;
                            </a>
                        </li>
                        {pageNumbers.slice(startPage - 1, endPage).map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <a onClick={() => paginate(number)} href="#!" className="page-link">
                                    {number}
                                </a>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                            <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
                                &raquo;
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
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
