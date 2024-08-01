import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Fuse from 'fuse.js';
import FlaggedStudentsTable from './FlaggedStudentsTable'; // Import the FlaggedStudents component
import CsvUpload from './CsvUpload';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MultiSelect } from 'react-multi-select-component';
import { CSVLink } from 'react-csv';

const Visits = () => {
    const [visits, setVisits] = useState([]); // methods for setting info for api calls
    const [students, setStudents] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [topics, setTopics] = useState([]);
    const [visitTopics, setVisitTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // setting current page (default 1)
    const [visitsPerPage] = useState(10); // how many visits per page?
    const [maxPageNumbersToShow] = useState(10); // how many pagination buttons at once?
    const [searchQuery, setSearchQuery] = useState(''); // search query state
    const [filteredVisits, setFilteredVisits] = useState([]); // filtered visits state
    const [mergedVisits, setMergedVisits] = useState([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState([]); // autocomplete options state
    const [selectedOption, setSelectedOption] = useState(null); // selected autocomplete option state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // sorting state
    const [selectedStudents, setSelectedStudents] = useState([]); // students filter state
    const [selectedCounselors, setSelectedCounselors] = useState([]); // counselors filter state
    const [selectedTopics, setSelectedTopics] = useState([]); // topics filter state
    const [selectedDate, setSelectedDate] = useState(null); // date filter state
    const [selectedColumns, setSelectedColumns] = useState({
        studentName: true,
        counselorName: true,
        formattedDate: true,
        description: true,
        filePath: true,
        parentsCalled: true,
        length: true,
        topicNames: true,
    }); // columns selection state

    //================================================================================//
    //================================API Calls=======================================//
    //================================================================================//
    //gather the json data from all the tables
    // since our DB is small, lets handle the organization of the data from the server in javascript
    // another option for this, if your data is massive, you could handle things like search and pagination on the api itself
    // but the amount of data we're receiving is not large enough for that

    useEffect(() => { // api call to gather information to populate table
        fetch('/api/Visit')
            .then(response => response.json())
            .then(data => setVisits(data))
            .catch(error => console.error('Error fetching visits data:', error));

        fetch('/api/Student') // api call to gather student names
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching student data:', error));

        fetch('/api/Counselor') // api call to gather counselor names
            .then(response => response.json())
            .then(data => setCounselors(data))
            .catch(error => console.error('Error fetching counselor data:', error));

        fetch('/api/Topic') // api call to gather topics
            .then(response => response.json())
            .then(data => setTopics(data))
            .catch(error => console.error('Error fetching topics data:', error));

        fetch('/api/VisitTopic') // api call to gather visit topics
            .then(response => response.json())
            .then(data => setVisitTopics(data))
            .catch(error => console.error('Error fetching visit topics data:', error));
    }, []);

    // Function to delete a visit
    const handleDelete = async (visitID) => {
        if (window.confirm("Are you sure you want to delete this visit?")) {
            try {
                await axios.delete(`/api/Visit/Delete?visitID=${visitID}`);
                setVisits(visits.filter(visit => visit.visitID !== visitID));
                setFilteredVisits(filteredVisits.filter(visit => visit.visitID !== visitID));
            } catch (error) {
                console.error("Error deleting visit:", error);
            }
        }
    };

    //================================================================================//
    //=================================Merge Tables===================================//
    //================================================================================//
    // Merge student, counselor names, and topics into visits data
    // visits doesn't contain any information about these things by itself except for IDs
    useEffect(() => {
        const mergeVisitsData = () => {
            return visits.map(visit => {
                const student = students.find(s => s.studentID === visit.studentID); // get the student object from students array based on ID from visits
                const counselor = counselors.find(c => c.counselorID === visit.counselorID); // same with counselors
                const visitTopicIDs = visitTopics.filter(vt => vt.visitID === visit.visitID).map(vt => vt.topicID); // and topics
                const visitTopicNames = topics.filter(topic => visitTopicIDs.includes(topic.topicID)).map(topic => topic.topicName);
                const formattedDate = new Date(visit.date).toLocaleDateString(); // so that we may fuzzy search date, turn it to string instead of datetime

                return {
                    ...visit,
                    studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown', // get first name and last name for student
                    counselorName: counselor ? counselor.name : 'Unknown', // counselor name
                    topicNames: visitTopicNames.length ? visitTopicNames : ['No Topics'], // create an array of topics
                    formattedDate // again, add formatted date for search purposes
                };
            });
        };

        const mergedVisits = mergeVisitsData();
        setMergedVisits(mergedVisits);
        setFilteredVisits(mergedVisits);
    }, [visits, students, counselors, topics, visitTopics]);

    //================================================================================//
    //========================Filter Functionality====================================//
    //================================================================================//
    // Function to handle filter changes
    const handleFilterChange = () => {
        let filtered = mergedVisits;

        if (selectedStudents.length > 0) {
            const selectedStudentIDs = selectedStudents.map(option => option.value);
            filtered = filtered.filter(visit => selectedStudentIDs.includes(visit.studentID));
        }
        if (selectedCounselors.length > 0) {
            const selectedCounselorIDs = selectedCounselors.map(option => option.value);
            filtered = filtered.filter(visit => selectedCounselorIDs.includes(visit.counselorID));
        }
        if (selectedTopics.length > 0) {
            const selectedTopicNames = selectedTopics.map(option => option.value);
            filtered = filtered.filter(visit => visit.topicNames.some(topic => selectedTopicNames.includes(topic)));
        }
        if (selectedDate) {
            const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();
            filtered = filtered.filter(visit => visit.formattedDate === formattedSelectedDate);
        }

        setFilteredVisits(filtered);
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedStudents, selectedCounselors, selectedTopics, selectedDate]);

    //================================================================================//
    //========================Fuzzy Search functionality==============================//
    //================================================================================//
    // Handle search query changes
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setSelectedOption(null);
        setCurrentPage(1);

        if (query.length === 0) { //return the filtered visits if there is no active search query
            handleFilterChange();
            setAutocompleteOptions([]);
            return;
        }

        const fuse = new Fuse(filteredVisits, { // use fuse to fuzzy search
            keys: [
                'studentName',
                'counselorName',
                'description',
                'topicNames',
                'formattedDate', // Include formatted date in the search keys
            ],
            threshold: 0.3
        });

        const result = fuse.search(query).map(result => result.item);
        setFilteredVisits(result);

        // Generate autocomplete options based on the search query
        const options = Array.from(new Set(result.flatMap(visit => [ // create an array, which will act as a select box for underneath the search bar
            visit.studentName,
            visit.counselorName,
            ...visit.topicNames,
            visit.description,
            visit.formattedDate
        ]))).filter(option => option.toLowerCase().includes(query.toLowerCase()));

        setAutocompleteOptions(options.slice(0, 5));
    };

    //================================================================================//
    //===========================AutoComplete selection===============================//
    //================================================================================//

    // Handle autocomplete option selection
    const handleOptionSelect = (option) => {
        setSearchQuery(option);
        setSelectedOption(option);

        const fuse = new Fuse(filteredVisits, {
            keys: [
                'studentName',
                'counselorName',
                'description',
                'topicNames',
                'formattedDate', // Include formatted date in the search keys
            ],
            threshold: 0.3
        });

        const result = fuse.search(option).map(result => result.item);
        setFilteredVisits(result);
        setCurrentPage(1);
        setAutocompleteOptions([]);
    };

    //================================================================================//
    //==========================OnClick Sort Functionality============================//
    //================================================================================//

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                direction = 'descending';
            } else if (sortConfig.direction === 'descending') {
                direction = null; // Reset to default
            }
        }
        setSortConfig({ key, direction });
    };

    const getCaret = (key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                return <i className="asc-icon" />;
            } else if (sortConfig.direction === 'descending') {
                return <i className="desc-icon" />;
            }
        }
        return null;
    };

    const sortedVisits = React.useMemo(() => {
        let sortableVisits = [...filteredVisits];
        if (sortConfig.key && sortConfig.direction) {
            sortableVisits.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sorting by visitID when sortConfig.direction is null
            sortableVisits.sort((a, b) => a.visitID - b.visitID);
        }
        return sortableVisits;
    }, [filteredVisits, sortConfig]);

    // Calculate the current visits to display based on pagination
    const indexOfLastVisit = currentPage * visitsPerPage; // grab index of the last visit on this page (page 5 * visitsPerPage(10) = 50)
    const indexOfFirstVisit = indexOfLastVisit - visitsPerPage; // grab index of first visit on this page (indexoflastvisit(50) - visitsPerPage(10) = 40 )
    const currentVisits = sortedVisits.slice(indexOfFirstVisit, indexOfLastVisit); // returns copy of array of index 40 - 50

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get the page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedVisits.length / visitsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Determine the range of page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(pageNumbers.length, startPage + maxPageNumbersToShow - 1);

    //================================================================================//
    //===========================Flagged Students Table===============================//
    //================================================================================//

    // Filter students with 5 or more visits in the current month
    const FlaggedStudents = React.useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const studentVisits = mergedVisits.reduce((acc, visit) => {
            const visitDate = new Date(visit.date);
            if (visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear) {
                if (!acc[visit.studentID]) {
                    acc[visit.studentID] = { ...visit, visitCount: 0 };
                }
                acc[visit.studentID].visitCount += 1;
            }
            return acc;
        }, {});
        return Object.values(studentVisits).filter(student => student.visitCount >= 5);
    }, [mergedVisits]);

    // Function to handle column selection change
    const handleColumnSelectionChange = (column) => {
        setSelectedColumns(prevState => ({
            ...prevState,
            [column]: !prevState[column]
        }));
    };
    const downloadName = "visits_" + (new Date().getMonth() + 1) + "_" + new Date().getDate() + "_" + new Date().getFullYear() + ".csv";

    // Prepare data for CSV download
    const csvData = filteredVisits.map(visit => {
        const rowData = {};
        if (selectedColumns.studentName) rowData.StudentName = visit.studentName;
        if (selectedColumns.counselorName) rowData.CounselorName = visit.counselorName;
        if (selectedColumns.formattedDate) rowData.Date = visit.formattedDate;
        if (selectedColumns.description) rowData.Description = visit.description;
        if (selectedColumns.filePath) rowData.FilePath = visit.filePath;
        if (selectedColumns.parentsCalled) rowData.ParentsCalled = visit.parentsCalled ? 'Yes' : 'No';
        if (selectedColumns.length) rowData.Length = visit.length;
        if (selectedColumns.topicNames) rowData.Topics = visit.topicNames.join(', ');
        return rowData;
    });

    //================================================================================//
    //===========================Table Return Section=================================//
    //================================================================================//
    // section where data is returned to the DOM

    return (
        <div>
            <div className="searchFeilds">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-bar"
                    autoComplete="off"
                />
                <MultiSelect
                    options={students.map(student => ({ label: `${student.firstName} ${student.lastName}`, value: student.studentID }))}
                    value={selectedStudents}
                    onChange={setSelectedStudents}
                    labelledBy="Select Students"
                />
                <MultiSelect
                    options={counselors.map(counselor => ({ label: counselor.name, value: counselor.counselorID }))}
                    value={selectedCounselors}
                    onChange={setSelectedCounselors}
                    labelledBy="Select Counselors"
                />
                <MultiSelect
                    options={topics.map(topic => ({ label: topic.topicName, value: topic.topicName }))}
                    value={selectedTopics}
                    onChange={setSelectedTopics}
                    labelledBy="Select Topics"
                />
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    isClearable
                    placeholderText="MM/DD/YYYY"
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.studentName}
                        onChange={() => handleColumnSelectionChange('studentName')}
                    />
                    Student Name
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.counselorName}
                        onChange={() => handleColumnSelectionChange('counselorName')}
                    />
                    Counselor Name
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.formattedDate}
                        onChange={() => handleColumnSelectionChange('formattedDate')}
                    />
                    Date
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.description}
                        onChange={() => handleColumnSelectionChange('description')}
                    />
                    Description
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.filePath}
                        onChange={() => handleColumnSelectionChange('filePath')}
                    />
                    File Path
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.parentsCalled}
                        onChange={() => handleColumnSelectionChange('parentsCalled')}
                    />
                    Parents Called
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.length}
                        onChange={() => handleColumnSelectionChange('length')}
                    />
                    Length
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedColumns.topicNames}
                        onChange={() => handleColumnSelectionChange('topicNames')}
                    />
                    Topics
                </label>
                <CSVLink data={csvData} filename={downloadName}>
                    Download CSV
                </CSVLink>
            </div>
            {autocompleteOptions.length > 0 && (
                <ul className="autocomplete-options">
                    {autocompleteOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className="autocomplete-option"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            {currentVisits.length === 0 ? (
                <div>
                    <div className="no-results-message">No results found</div> {/*display an error message instead of table if there is nothing there*/}
                </div>
            ) : (
                <>
                    <table id="visitsTable">
                        <thead>
                            <tr>
                                {selectedColumns.studentName && <th onClick={() => handleSort('studentName')}>Student {getCaret('studentName')}</th>}
                                {selectedColumns.counselorName && <th onClick={() => handleSort('counselorName')}>Counselor {getCaret('counselorName')}</th>}
                                {selectedColumns.formattedDate && <th onClick={() => handleSort('formattedDate')}>Date {getCaret('formattedDate')}</th>}
                                {selectedColumns.description && <th onClick={() => handleSort('description')}>Description {getCaret('description')}</th>}
                                {selectedColumns.filePath && <th onClick={() => handleSort('filePath')}>File Path {getCaret('filePath')}</th>}
                                {selectedColumns.parentsCalled && <th onClick={() => handleSort('parentsCalled')}>Parents Called {getCaret('parentsCalled')}</th>}
                                {selectedColumns.length && <th onClick={() => handleSort('length')}>Length {getCaret('length')}</th>}
                                {selectedColumns.topicNames && <th onClick={() => handleSort('topicNames')}>Topics {getCaret('topicNames')}</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVisits.map(visit => (
                                <tr key={visit.visitID}>
                                    {selectedColumns.studentName && <td>{visit.studentName}</td>}
                                    {selectedColumns.counselorName && <td>{visit.counselorName}</td>}
                                    {selectedColumns.formattedDate && <td>{visit.formattedDate}</td>}
                                    {selectedColumns.description && <td>{visit.description}</td>}
                                    {selectedColumns.filePath && <td>{visit.filePath}</td>}
                                    {selectedColumns.parentsCalled && <td>{visit.parentsCalled ? 'Yes' : 'No'}</td>}
                                    {selectedColumns.length && <td>{visit.length}</td>}
                                    {selectedColumns.topicNames && <td>{visit.topicNames.join(', ')}</td>}
                                    <td><button onClick={() => window.location.href = `/Edit/EditVisit/${visit.visitID}`}>Edit</button><button onClick={() => handleDelete(visit.visitID)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-container">
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
                        <span>Page {currentPage} of {pageNumbers.length}</span>
                    </div>
                </>
            )}
            <CsvUpload onUploadSuccess={() => { /* Implement this if you want to re-fetch data after CSV upload */ }} />
            <FlaggedStudentsTable FlaggedStudents={FlaggedStudents} />
        </div>
    );
};

export default Visits;

//================================================================================//
//===========================Render In DOM========================================//
//================================================================================//
const VisitsTable = ReactDOM.createRoot(document.getElementById('homeTables'));
VisitsTable.render(
    <React.StrictMode>
        <Visits />
    </React.StrictMode>
);
