import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Fuse from 'fuse.js';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10); // how many students per page?
    const [maxPageNumbersToShow] = useState(5); // how many pagination buttons at once?
    const [searchTerm, setSearchTerm] = useState('');

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
                                <a href={`/Students/Edit/${student.studentID}`}>Edit</a> |
                                <a href={`/Students/Details/${student.studentID}`}>Details</a> |
                                <a href={`/Students/Delete/${student.studentID}`}>Delete</a>
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
