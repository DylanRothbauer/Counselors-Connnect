import React, { useState } from 'react';
import axios from 'axios';

const CsvUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [spinner, setSpinner] = useState(false);
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        document.getElementById("display-selection").innerText = event.target.files[0].name
        setErrorMessage('');
        setSuccessMessage('');
    };

    const validateCsv = (file) => {
        const requiredHeaders = [
            'StudentID', 'CounselorID', 'VisitDate', 'Description',
            'File', 'FilePath', 'ParentsCalled', 'Length', 'FirstName',
            'LastName', 'Grade', 'AdvisorName', 'CounselorName', 'CounselorUsername',
            'CounselorPassword', 'Topics'
        ];

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result.replace(/['"]/g, "");
                const headers = text.split('\n')[0].split(',').map(header => header.trim());
                const isValid = requiredHeaders.every(header => headers.includes(header));
                let errorBuilder = "";

                requiredHeaders.forEach(header => {
                    if (!headers.includes(header)) {
                        errorBuilder += `expected a header named "${header}", but it wasn't found\n`;
                    }
                });

                if (errorBuilder) {
                    setErrorMessage(errorBuilder);
                    reject(errorBuilder);  // Reject with the error message
                } else {
                    setErrorMessage('');
                    resolve();
                }
            };
            reader.readAsText(file);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setSuccessMessage('')
            setErrorMessage('Please select a file.');
            return;
        }

        try {
            await validateCsv(selectedFile);
            const formData = new FormData();
            formData.append('file', selectedFile);
            setSpinner(true);
            const response = await axios.post('/api/CsvUpload/uploadCsv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSuccessMessage('File uploaded successfully!');
                setErrorMessage('');
            } else {
                setErrorMessage('File upload failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error?.response?.data || error || 'An error occurred. Please try again.');
        }
        finally {
            setSpinner(false);
        }
    };

    const renderErrorMessages = () => {
        if (!errorMessage) return null;
        
        const errorList = errorMessage.toString().split('\n').filter(error => error.trim() !== '');
        return (
            <ul style={{ color: 'red' }}>
                {errorList.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        );
    };

    return (
        <div id="csv-upload" className="m-4">
            <h2 className="d-flex justify-content-center">Upload the CSV File</h2>
            <div className="upload-body">
                <div className="d-flex align-items-center my-3">
                    <button className="btn primary-btn border border-0">
                        <label htmlFor='file-upload'>Select File</label>
                    </button>
              
                    <input className="primary-btn" id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
                    <p id="display-selection" className="m-0 ms-2">No File Selected.</p>
                </div>
            
                <button className="primary-btn border border-0 mt-3 mb-2" onClick={handleUpload}>Upload</button> {spinner && (                   
                    <div className="spinner-container">
                        <div className="spinner-border mt-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>                    
                )}
                {renderErrorMessages()}
                {!spinner && successMessage && <p className="text-name" style={{ color: 'green' }}>{successMessage}</p>}
            </div>
            
        </div>
    );
};

export default CsvUpload;
