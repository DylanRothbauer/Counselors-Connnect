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

    // Create a Fuse instance with students data and fuseOptions
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

    // State to hold filtered students
    const [filteredStudents, setFilteredStudents] = useState(students);

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Get the page numbers on filtered students
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredStudents.length / studentsPerPage); i++) {
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
        <div id="table-container">
            <div className="d-flex justify-content-between py-3">

                <div className="search-bar">
                    <input
                        type="text"
                            className="p-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <a type="button" href="/students/create" className="btn primary-btn">Create New</a>
                </div>
            </div>
            {filteredStudents.length === 0 ? (
                <div className="alert d-flex justify-content-center ">No results found.</div> // If no results, display div, otherwise continue with table :)
                ) : (
                <div>
                       
            
                    <div className="round-table">
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
                                        <td className="text-center">
                                            <button className="btn" onClick={() => handleEditButtonClick(student.studentID)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                            <button className="btn" onClick={() => handleDeleteConfirmation(student.studentID)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fillRule="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
          
                    {/* Pagination */}
                    <div className="pagination-container py-3">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4CAF50 !important" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                        </svg>
                                    </a>
                                </li>
                                {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(number => (
                                    <li key={number} className={`ms-2 page-item ${currentPage === number ? 'active' : ''}`}>                                     
                                        <a onClick={() => paginate(number)} href="#!" className="btn rounded-circle page-link">
                                            <span>{number}</span>
                                        </a>
                                    </li>
                                ))}
                                <li className={`page-item ms-2 ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                    <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4CAF50 !important" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <span>Page {currentPage} of {pageNumbers.length}</span>
                    </div>
                </div>
            )}
            
        </div>
    )
};


export default StudentsList;

// React DOM rendering
const student = ReactDOM.createRoot(document.getElementById('students'));
student.render(
    <React.StrictMode>
        <StudentsList />
    </React.StrictMode>
);