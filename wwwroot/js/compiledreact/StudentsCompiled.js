/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./components/Students.js":
/*!********************************!*\
  !*** ./components/Students.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module 'fuse.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n\nconst StudentsList = () => {\n  const [students, setStudents] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);\n  const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);\n  const [studentsPerPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(10); // how many students per page?\n  const [maxPageNumbersToShow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(5); // how many pagination buttons at once?\n  const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');\n  const [deleteStudentId, setDeleteStudentId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null); // Track student ID to delete\n\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    // Fetch students data\n    fetch('/api/Student').then(response => response.json()).then(data => {\n      setStudents(data);\n    }).catch(error => console.error('Error fetching students:', error));\n  }, []);\n\n  // Filtered students based on search term (manual)\n  //const filteredStudents = students.filter(student =>\n  //    `${student.firstName} ${student.lastName} ${student.studentID} ${student.grade} ${student.advisorName}`\n  //        .toLowerCase()\n  //        .includes(searchTerm.toLowerCase())\n  //);\n\n  // Fuse.js configuration for fuzzy search\n  const fuseOptions = {\n    keys: ['firstName', 'lastName', 'studentID', 'grade', 'advisorName'],\n    includeScore: true,\n    threshold: 0.4\n  };\n  const fuse = new Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'fuse.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(students, fuseOptions);\n\n  // Function to perform fuzzy search and update filtered students\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    if (searchTerm.trim() === '') {\n      setFilteredStudents(students);\n    } else {\n      const results = fuse.search(searchTerm);\n      const filteredStudents = results.map(result => result.item);\n      setFilteredStudents(filteredStudents);\n    }\n    setCurrentPage(1); // Reset to first page after search\n  }, [searchTerm, students]); // Dependencies that will execute the effect when either one changes?\n\n  const [filteredStudents, setFilteredStudents] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(students);\n\n  // Pagination logic\n  const indexOfLastStudent = currentPage * studentsPerPage;\n  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;\n  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);\n\n  // Change page\n  const paginate = pageNumber => {\n    setCurrentPage(pageNumber);\n  };\n\n  // Pagination related functions and variables\n  const pageNumbers = Math.ceil(filteredStudents.length / studentsPerPage);\n\n  // Determine the range of page numbers to display\n  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));\n  const endPage = Math.min(pageNumbers, startPage + maxPageNumbersToShow - 1);\n\n  // Function to handle edit button click\n  const handleEditButtonClick = studentID => {\n    // Redirect to the edit page\n    window.location.href = \"/Edit/EditStudent/\".concat(studentID);\n  };\n\n  // Function to handle delete confirmation\n  const handleDeleteConfirmation = studentID => {\n    setDeleteStudentId(studentID);\n    if (window.confirm(\"Are you sure you want to delete student \".concat(studentID, \"?\"))) {\n      deleteStudent(studentID);\n    }\n  };\n\n  // Function to delete student via DELETE request\n  const deleteStudent = studentID => {\n    fetch(\"/api/Student/Delete?studentid=\".concat(studentID), {\n      method: \"Delete\",\n      body: {\n        studentid: studentID\n      }\n    }).then(() => {\n      window.location.reload();\n    }).catch(err => {\n      console.log(err.message);\n    });\n  };\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h1\", null, \"Students\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"p\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    href: \"/students/create\"\n  }, \"Create New\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"search-bar\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"input\", {\n    type: \"text\",\n    placeholder: \"Search...\",\n    value: searchTerm,\n    onChange: e => setSearchTerm(e.target.value)\n  })), filteredStudents.length === 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"alert alert-info\"\n  }, \"No results found.\") // If no results, display div, otherwise continue with table :)\n  : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"table\", {\n    className: \"table\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"thead\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"tr\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"th\", null, \"Student\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"th\", null, \"Advisor\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"th\", null, \"ID #\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"th\", null, \"Grade Level\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"th\", null, \"Actions\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"tbody\", null, currentStudents.map(student => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"tr\", {\n    key: student.studentID\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"td\", null, student.lastName, \", \", student.firstName), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"td\", null, student.advisorName), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"td\", null, student.studentID), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"td\", null, student.grade), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"td\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"button\", {\n    className: \"btn btn-primary\",\n    onClick: () => handleEditButtonClick(student.studentID)\n  }, \"Edit\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"button\", {\n    className: \"btn btn-danger\",\n    onClick: () => handleDeleteConfirmation(student.studentID)\n  }, \"Delete\")))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"pagination-container\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"span\", null, \"Page \", currentPage, \" of \", pageNumbers), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"nav\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"ul\", {\n    className: \"pagination\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"li\", {\n    className: \"page-item \".concat(currentPage === 1 ? 'disabled' : '')\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    onClick: () => paginate(currentPage - 1),\n    href: \"#!\",\n    className: \"page-link\"\n  }, \"\\xAB\")), Array.from({\n    length: endPage - startPage + 1\n  }, (_, index) => startPage + index).map(number => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"li\", {\n    key: number,\n    className: \"page-item \".concat(currentPage === number ? 'active' : '')\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    onClick: () => paginate(number),\n    href: \"#!\",\n    className: \"page-link\"\n  }, number))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"li\", {\n    className: \"page-item \".concat(currentPage === pageNumbers ? 'disabled' : '')\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    onClick: () => paginate(currentPage + 1),\n    href: \"#!\",\n    className: \"page-link\"\n  }, \"\\xBB\")))))));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StudentsList);\n\n// React DOM rendering\nconst student = react_dom__WEBPACK_IMPORTED_MODULE_1___default().createRoot(document.getElementById('students'));\nstudent.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StudentsList, null)));\n\n//# sourceURL=webpack://reactapp/./components/Students.js?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./components/Students.js");
/******/ 	
/******/ })()
;