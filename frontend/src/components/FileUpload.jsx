import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
    },
  });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setResult(null);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8000/predict/', formData);
      
      // Ensure the image URL is properly constructed
      const imageUrl = response.data.image_url.startsWith('http') 
        ? response.data.image_url 
        : `http://localhost:8000${response.data.image_url}`;
      
      setResult({
        disease: response.data.prediction.class,
        confidence: response.data.prediction.confidence,
        predictions: response.data.prediction.all_predictions,
        imageUrl: imageUrl
      });
  
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop a wheat leaf image here, or click to select</p>
      </div>

      {file && (
        <div style={{ margin: '20px 0' }}>
          <h4>Selected Image:</h4>
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={isLoading}
        style={buttonStyle}
      >
        {isLoading ? 'Analyzing...' : 'Detect Disease'}
      </button>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      {isLoading && <p>Processing image... Please wait.</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Analysis Results</h3>
          <p><strong>Status:</strong> {result.disease}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          
          <h4>Detailed Predictions:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(result.predictions).map(([disease, value]) => (
              <li key={disease} style={{ margin: '5px 0' }}>
                {disease}: {(value * 100).toFixed(2)}%
              </li>
            ))}
          </ul>

          {result.imageUrl && (
            <div style={{ marginTop: '15px' }}>
              <h4>Processed Image:</h4>
              <img 
                src={`http://localhost:8000${result.imageUrl}`}
                alt="Analyzed wheat leaf"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const dropzoneStyle = {
  border: '2px dashed #0087F7',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default FileUpload;