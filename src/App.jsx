import React, { useState } from 'react';
import ColorPickerComponent from './ColorPicker.jsx'; // Import the ColorPicker component
import ImageColorExtractor from './ImageColorExtractor.jsx'; // Import the ImageColorExtractor component

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pickedColor, setPickedColor] = useState(null);

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (e) => setUploadedImage(e.target.result);
  };

  const handleColorPick = (color) => {
    setPickedColor(color);
  };

  return (
    <div className="App">
      <h1>Image Color Picker</h1>
      <ColorPickerComponent onColorPick={handleColorPick} />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploadedImage && <ImageColorExtractor uploadedImage={uploadedImage} onColorPick={handleColorPick} />}
      {pickedColor && <p>Picked Color: {pickedColor}</p>}
    </div>
  );
}

export default App;
