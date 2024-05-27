import React, { useState, useEffect } from 'react';
import ImageColorExtractor from './ImageColorExtractor.jsx';
import ColorPicker from './ColorPicker.jsx'; // Import the ColorPicker component
import axios from 'axios';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [extractedColors, setExtractedColors] = useState([]);
  const [storedColors, setStoredColors] = useState(() => {
    const storedColors = localStorage.getItem('storedColors');
    return storedColors ? JSON.parse(storedColors) : [];
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('storedColors', JSON.stringify(storedColors));
  }, [storedColors]);

  useEffect(() => {
    if (token) {
      fetchColors();
    }
  }, [token]);

  const handleModeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));

    Promise.all(
      Array.from(files).map((file) => extractImageColor(file))
    ).then((extractedColors) => {
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      setExtractedColors(extractedColors);
    });
  };

  const extractImageColor = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;

        image.onload = function () {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = image.width;
          canvas.height = image.height;

          context.drawImage(image, 0, 0);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let r = 0, g = 0, b = 0, count = 0;

          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }

          const averageColor = `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;

          resolve(averageColor);
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const handleColorPick = (color) => {
    setStoredColors((prevColors) => [...prevColors, color]);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/token', {
        permissions: ['READ', 'WRITE'],
        role: 'ADMIN',
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchColors = async () => {
    try {
      // No need to fetch colors from the backend
    } catch (error) {
      console.error('Fetching colors failed:', error);
    }
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <button className={`mode-toggle ${isDarkMode ? 'dark-mode' : ''}`} onClick={handleModeToggle}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        {!token && (
          <button className={`login-button ${isDarkMode ? 'dark-mode' : ''}`} onClick={handleLogin}>
            Login
          </button>
        )}
      </header>
      <main>
        <h1 className={`title ${isDarkMode ? 'dark-mode' : ''}`}>Image Color Picker</h1>
        <input
          className={`file-input ${isDarkMode ? 'dark-mode' : ''}`}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <ColorPicker onColorPick={handleColorPick} /> {/* Add the ColorPicker component */}
        <div className="image-container">
          {uploadedImages.map((image, index) => (
            <ImageColorExtractor
              key={index}
              uploadedImage={image}
              onColorPick={handleColorPick}
            />
          ))}
        </div>
        <div className="colors-container">
          <h2 className={`section-title ${isDarkMode ? 'dark-mode' : ''}`}>Extracted Colors</h2>
          <div className={`colors ${isDarkMode ? 'dark-mode' : ''}`}>
            {extractedColors.map((color, index) => (
              <div
                key={index}
                className={`color-box ${isDarkMode ? 'dark-mode' : ''}`}
                style={{ color }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>
        <div className="colors-container">
          <h2 className={`section-title ${isDarkMode ? 'dark-mode' : ''}`}>Stored Colors</h2>
          <div className={`colors ${isDarkMode ? 'dark-mode' : ''}`}>
            {storedColors.map((color, index) => (
              <div
                key={index}
                className={`color-box ${isDarkMode ? 'dark-mode' : ''}`}
                style={{ color }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;