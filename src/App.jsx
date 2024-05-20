import React, { useState, useEffect } from 'react';
import ColorPickerComponent from './ColorPicker.jsx';
import ImageColorExtractor from './ImageColorExtractor.jsx';
import  Appstyles from './App.css'
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageColors, setImageColors] = useState(() => {
    // Retrieve stored colors from local storage
    const storedColors = localStorage.getItem('imageColors');
    return storedColors ? JSON.parse(storedColors) : [];
  });

  useEffect(() => {
    // Update the document body class based on the mode
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Store the colors in local storage whenever they change
    localStorage.setItem('imageColors', JSON.stringify(imageColors));
  }, [imageColors]);

  function handleModeToggle() {
    setIsDarkMode(!isDarkMode); // Toggle the state
  }

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));

    // Extract and store image colors for each uploaded image
    Promise.all(
      Array.from(files).map((file) => extractImageColor(file))
    ).then((extractedColors) => {
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      setImageColors((prevColors) => [...prevColors, ...extractedColors]);
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

          context.drawImage(image, 0, 0); // Draw image on canvas

          // Get average dominant color (adjust as needed)
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let r = 0, g = 0, b = 0, count = 0; // Declare variables for color values

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

      reader.readAsDataURL(file); // Read image file as data URL
    });
  };

  const handleColorPick = (color) => {
    setImageColors((prevColors) => [...prevColors, color]);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <header>
        <button onClick={handleModeToggle}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </header>
      <h1>Image Color Picker</h1>
      <ColorPickerComponent onColorPick={handleColorPick} />
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <div className="image-container">
        {uploadedImages.map((image, index) => (
          <ImageColorExtractor key={index} uploadedImage={image} onColorPick={handleColorPick} />
        ))}
      </div>
      <div className="colors">
        {imageColors.map((color, index) => (
          <div key={index} className="color-box" style={{ backgroundColor: color }}>
            {color}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;