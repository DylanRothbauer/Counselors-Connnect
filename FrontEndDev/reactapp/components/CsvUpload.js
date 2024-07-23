import React, { useState } from 'react';
import axios from 'axios';

const CsvUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
                const text = e.target.result;
                const headers = text.split('\n')[0].split(',').map(header => header.trim());
                const isValid = requiredHeaders.every(header => headers.includes(header));

                if (isValid) {
                    resolve();
                } else {
                    reject('Invalid CSV format. Please triple check the headers.');
                }
            };
            reader.readAsText(file);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file.');
            return;
        }

        try {
            await validateCsv(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/api/CsvUpload/uploadCsv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSuccessMessage('File uploaded successfully!');
                onUploadSuccess();
            } else {
                setErrorMessage('File upload failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload the CSV File</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default CsvUpload;
