import React, { useState } from 'react';
import { ColorExtractor } from 'react-color-extractor';

function ImageColorExtractor({ uploadedImage, onColorPick }) {
  const [colors, setColors] = useState([]);

  const handleColorPick = (color) => {
    onColorPick(color);
  };

  return (
    <div>
      <h2>Extracted Colors</h2>
      <ColorExtractor src={uploadedImage} getColors={(colors) => setColors(colors)} />
      <h3>Pick a Color</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              width: '50px',
              height: '50px',
              margin: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleColorPick(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageColorExtractor;
