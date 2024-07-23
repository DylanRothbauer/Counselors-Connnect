import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Fuse from 'fuse.js';
import FlaggedStudents from './flaggedStudents'; // Import the FlaggedStudents component

const Visits = () => {
    const [visits, setVisits] = useState([]); // methods for setting info for api calls
    const [students, setStudents] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [topics, setTopics] = useState([]);
    const [visitTopics, setVisitTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // setting current page (default 1)
    const [visitsPerPage] = useState(10); // how many visits per page?
    const [maxPageNumbersToShow] = useState(5); // how many pagination buttons at once?
    const [searchQuery, setSearchQuery] = useState(''); // search query state
    const [filteredVisits, setFilteredVisits] = useState([]); // filtered visits state
    const [autocompleteOptions, setAutocompleteOptions] = useState([]); // autocomplete options state
    const [selectedOption, setSelectedOption] = useState(null); // selected autocomplete option state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // sorting state


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
        setFilteredVisits(mergedVisits);
    }, [visits, students, counselors, topics, visitTopics]);

    
    //================================================================================//
    //========================Fuzzy Search functionality==============================//
    //================================================================================//
    // Handle search query changes
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setSelectedOption(null);

       
            // get merged visits (IE. the defautl view) if there is no query
            const mergedVisits = visits.map(visit => {
                const student = students.find(s => s.studentID === visit.studentID);
                const counselor = counselors.find(c => c.counselorID === visit.counselorID);
                const visitTopicIDs = visitTopics.filter(vt => vt.visitID === visit.visitID).map(vt => vt.topicID);
                const visitTopicNames = topics.filter(topic => visitTopicIDs.includes(topic.topicID)).map(topic => topic.topicName);
                const formattedDate = new Date(visit.date).toLocaleDateString();

                return {
                    ...visit,
                    studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
                    counselorName: counselor ? counselor.name : 'Unknown',
                    topicNames: visitTopicNames.length ? visitTopicNames : ['No Topics'],
                    formattedDate // Add formatted date for search purposes
                };
            });


            if (query.length === 0) { //return  the filtered visits if there is no active search query 
                setFilteredVisits(mergedVisits);
                setAutocompleteOptions([]);
                return;
            }
     
        
        const fuse = new Fuse(mergedVisits, { // use fuse to fuzzy search
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

        setAutocompleteOptions(options);
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
    const flaggedStudents = React.useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const studentVisits = visits.reduce((acc, visit) => {
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
    }, [visits]);

    //================================================================================//
    //===========================Table Return Section=================================//
    //================================================================================//
    // section where data is returned to the DOM

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                autoComplete="off"
            />
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
                    <table itemID="visitsTable">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('studentName')}>Student {getCaret('studentName')}</th>
                                <th onClick={() => handleSort('counselorName')}>Counselor {getCaret('counselorName')}</th>
                                <th onClick={() => handleSort('formattedDate')}>Date {getCaret('formattedDate')}</th>
                                <th onClick={() => handleSort('description')}>Description {getCaret('description')}</th>
                                <th onClick={() => handleSort('file')}>File {getCaret('file')}</th>
                                <th onClick={() => handleSort('filePath')}>File Path {getCaret('filePath')}</th>
                                <th onClick={() => handleSort('parentsCalled')}>Parents Called {getCaret('parentsCalled')}</th>
                                <th onClick={() => handleSort('length')}>Length {getCaret('length')}</th>
                                <th onClick={() => handleSort('topicNames')}>Topics {getCaret('topicNames')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVisits.map(visit => (
                                <tr key={visit.visitID}>
                                    <td>{visit.studentName}</td>
                                    <td>{visit.counselorName}</td>
                                    <td>{visit.formattedDate}</td>
                                    <td>{visit.description}</td>
                                    <td>{visit.file ? 'Yes' : 'No'}</td>
                                    <td>{visit.filePath}</td>
                                    <td>{visit.parentsCalled ? 'Yes' : 'No'}</td>
                                    <td>{visit.length}</td>
                                    <td>{visit.topicNames.join(', ')}</td>
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
            <FlaggedStudents flaggedStudents={flaggedStudents} />
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

