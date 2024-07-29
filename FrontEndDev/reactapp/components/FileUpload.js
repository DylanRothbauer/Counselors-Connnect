import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { BlobServiceClient } from '@azure/storage-blob';

const FileUpload = ({ sendFilePath }) => {
    const [file, setFile] = useState(null);
    const [uploadURL, setUploadURL] = useState('');
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const sasToken = 'se=2025-07-17T15%3A01Z&sp=rwdlacup&sv=2022-11-02&ss=b&srt=sco&sig=1XY%2BMeNSlOESK4gQoK/alt3FIIonrk7RhX%2B3u7Jy9XE%3D'; // Your SAS token
        const accountName = 'counselorsconnectstor';
        const containerName = 'counselorsconnectblob'; 

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net?${sasToken}`
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobName = new Date().getTime() + '-' + file.name;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            await blockBlobClient.uploadData(file);
            const url = blockBlobClient.url;
            setUploadURL(url);
            alert(`File uploaded successfully! URL: ${url}`);
            sendFilePath(uploadURL);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
            {uploadURL && (
                <div>
                    <p>File URL:</p>
                    <a href={uploadURL} target="_blank" rel="noopener noreferrer">{uploadURL}</a>
                </div>
            )}
        </div>
    );
};

export default FileUpload;


// React DOM rendering
/*
const fileUpload = ReactDOM.createRoot(document.getElementById('fileUpload'));
fileUpload.render(
    <React.StrictMode>
        <FileUpload />
    </React.StrictMode>
);
*/