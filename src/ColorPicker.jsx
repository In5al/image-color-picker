import React, { useState } from 'react';
import ColorPicker from 'react-color';

function ColorPickerComponent() {
  const [selectedColor, setSelectedColor] = useState('#fff');

  const handleColorChange = (color) => setSelectedColor(color.hex);

  return (
    <div>
      <h2>Color Picker</h2>
      <ColorPicker color={selectedColor} onChange={handleColorChange} />
      <p>Selected Color: {selectedColor}</p>
    </div>
  );
}

export default ColorPickerComponent;