import React, { useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Fuse from 'fuse.js';
import FlaggedStudentsTable from './FlaggedStudentsTable'; // Import the FlaggedStudents component
import CsvUpload from './CsvUpload';
import axios from 'axios';

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
    const [expandedTds, setExpandedTds] = useState({}); //expands table element
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

    const expandTd = (index) => {
        console.log(index)
       
        setExpandedTds(prevState => ({
            ...prevState,
            [index]: !prevState[index] // Toggle the expanded state
        }));
    }

    //================================================================================//
    //===========================Table Return Section=================================//
    //================================================================================//
    // section where data is returned to the DOM

    return (
        <div id="home-container">
            <div className="search-fields row mt-5 d-none d-sm-flex">
                <div className="col-4 p-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-bar border border-0 p-3"
                        autoComplete="off"
                        
                        />
                </div>
                <div className="col-2 p-0">
                    <MultiSelect
                        options={students.map(student => ({ label: `${student.firstName} ${student.lastName}`, value: student.studentID }))}
                        value={selectedStudents}
                        onChange={setSelectedStudents}
                        labelledBy="Select Students"
                        className="border border-0"
                        overrideStrings={{ selectSomeItems: "Advisor" }}
                        />
                </div>
                <div className="col-2 p-0">
                    <MultiSelect
                        options={counselors.map(counselor => ({ label: counselor.name, value: counselor.counselorID }))}
                        value={selectedCounselors}
                        onChange={setSelectedCounselors}
                        labelledBy="Select Counselors"
                        className="border border-0"
                        overrideStrings={{selectSomeItems: "Students" }}
                        />
                </div>
                <div className="col-2 p-0">
                    <MultiSelect
                        options={topics.map(topic => ({ label: topic.topicName, value: topic.topicName }))}
                        value={selectedTopics}
                        onChange={setSelectedTopics}
                        labelledBy="Select Topics"
                        className="border border-0"
                        overrideStrings={{ selectSomeItems: "Topics" }}
                        />
                </div>
                <div className="col-2 p-0">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        isClearable
                        placeholderText="MM/DD/YYYY"
                        className="border border-0"
                        />
                </div>
            </div>
            <div className="search-fields-mobile mt-5 d-flex d-sm-none">
                <div className="col p-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-bar p-3"
                        autoComplete="off"

                    />
                </div>
                <div className="col p-0 mt-2">
                    <MultiSelect
                        options={students.map(student => ({ label: `${student.firstName} ${student.lastName}`, value: student.studentID }))}
                        value={selectedStudents}
                        onChange={setSelectedStudents}
                        labelledBy="Select Students"
                        className="border border-0"
                        overrideStrings={{ selectSomeItems: "Advisor" }}
                    />
                </div>
                <div className="col p-0 mt-2">
                    <MultiSelect
                        options={counselors.map(counselor => ({ label: counselor.name, value: counselor.counselorID }))}
                        value={selectedCounselors}
                        onChange={setSelectedCounselors}
                        labelledBy="Select Counselors"
                        className="border border-0"
                        overrideStrings={{ selectSomeItems: "Students" }}
                    />
                </div>
                <div className="col p-0 mt-2">
                    <MultiSelect
                        options={topics.map(topic => ({ label: topic.topicName, value: topic.topicName }))}
                        value={selectedTopics}
                        onChange={setSelectedTopics}
                        labelledBy="Select Topics"
                        className="border border-0"
                        overrideStrings={{ selectSomeItems: "Topics" }}
                    />
                </div>
                <div className="col p-0 mt-2">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        isClearable
                        placeholderText="MM/DD/YYYY"
                        className="border border-0 p-3"
                    />
                </div>
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
                    <div className="section row mt-4">
                       
                        <div className="table-container px-2 px-sm-5 col-12 ">
                           <div className="justify-content-between align-items-center d-none d-sm-flex col-12 py-2">
                           
                            <h2 className="d-flex justify-content-center pt-3">Student Visits</h2>
                            <button className="btn primary-btn" data-bs-toggle="modal" data-bs-target="#downloadCSVModal">
                                Download Visits
                            </button>
                            <div class="modal fade" id="downloadCSVModal" tabindex="-1" aria-labelledby="download" aria-hidden="true">
                                <div class="modal-dialog d-flex align-items-center">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="download">Select Columns</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
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
                                                
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            
                                            <CSVLink data={csvData} filename={downloadName} className="primary-btn m-0 ">
                                                Download CSV
                                            </CSVLink>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                            <div className="round-table table-responsive mt-2 mt-sm-0">
                                <table id="visitsTable">
                                    <thead>
                                        <tr>
                                            {<th onClick={() => handleSort('studentName')}>Student {getCaret('studentName')}</th>}
                                            {<th onClick={() => handleSort('counselorName')}>Counselor {getCaret('counselorName')}</th>}
                                            {<th onClick={() => handleSort('formattedDate')}>Date {getCaret('formattedDate')}</th>}
                                            {<th onClick={() => handleSort('description')}>Description {getCaret('description')}</th>}
                                            {<th onClick={() => handleSort('filePath')}>File Path {getCaret('filePath')}</th>}
                                            {<th onClick={() => handleSort('parentsCalled')}>Parents Called {getCaret('parentsCalled')}</th>}
                                            {<th onClick={() => handleSort('length')}>Length {getCaret('length')}</th>}
                                            {<th onClick={() => handleSort('topicNames')}>Topics {getCaret('topicNames')}</th>}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVisits.map(visit => (
                                            <tr key={visit.visitID}>
                                                {<td style={{ maxWidth: expandedTds[1] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(1)}>{visit.studentName}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[2] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(2)}>{visit.counselorName}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[3] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(3)}>{visit.formattedDate}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[4] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(4)}>{visit.description}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[5] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(5)}>{visit.filePath}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[6] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(6)}>{visit.parentsCalled ? 'Yes' : 'No'}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[7] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(7)}>{visit.length}</button> </td>}
                                                {<td style={{ maxWidth: expandedTds[8] ? 'fit-content' : '95px' }}><button className="btn" onClick={() => expandTd(8)}>{visit.topicNames.join(', ')}</button> </td>}
                                                <td>
                                                    <button onClick={() => window.location.href = `/Edit/EditVisit/${visit.visitID}`} className="btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(visit.visitID)} className="btn">
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
                </div>
            )}
            <div className="row">
                <div className="section my-5 d-none d-sm-block col-5">
                    <CsvUpload onUploadSuccess={() => { /* Implement this if you want to re-fetch data after CSV upload */ }} />
                </div>
                <div className="section my-5 col-12 col-sm-5">
                    <FlaggedStudentsTable FlaggedStudents={FlaggedStudents} />
                </div>
            </div>
        </div>
    );
};

export default Visits;

//================================================================================//
//===========================Render In DOM========================================//
//================================================================================//
const VisitsTable = ReactDOM.createRoot(document.getElementById('home-tables'));
VisitsTable.render(
    <React.StrictMode>
        <Visits />
    </React.StrictMode>
);
