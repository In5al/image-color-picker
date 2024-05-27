import React, { useState, useEffect } from 'react';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const response = await fetch('http://localhost:3000/photos', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setPhotos(data);
    } else {
      console.error('Failed to fetch photos');
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div>
      <h1>Photo Gallery</h1>
      <ul>
        {photos.map(photo => (
          <li key={photo._id}>
            <img src={photo.url} alt="uploaded" />
            <ul>
              {photo.colors.map((color, index) => (
                <li key={index} style={{ backgroundColor: color.hex }}>
                  {color.hex} ({color.count})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotoGallery;
