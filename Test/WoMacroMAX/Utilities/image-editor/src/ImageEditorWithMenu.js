import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import './ImageEditorWithMenu.css';
import getCroppedImg from './utils/cropImage';

const ImageEditorWithMenu = () => {
  const inputRef = useRef();
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const saveImage = async () => {
    const cropped = await getCroppedImg(image, croppedAreaPixels, rotation, flipX, opacity);
    const a = document.createElement('a');
    a.href = cropped;
    a.download = 'edited-image.png';
    a.click();
  };

  return (
    <div className="editor-container">
      {/* Stylish Burger Button */}
      <button className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar Menu with Bootstrap UI */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="d-grid gap-3">
          <div className="form-group">
            <label className="form-label fw-bold">Upload Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleUpload} ref={inputRef} />
          </div>

          <div className="form-group">
            <label className="form-label fw-bold">Zoom</label>
            <input type="range" className="form-range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label fw-bold">Rotation</label>
            <input type="range" className="form-range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label fw-bold">Opacity</label>
            <input type="range" className="form-range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
          </div>

          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={flipX} onChange={() => setFlipX(!flipX)} id="flipCheck" />
            <label className="form-check-label" htmlFor="flipCheck">Flip Horizontally</label>
          </div>

          <button className="btn btn-success mt-2" onClick={saveImage}>💾 Save Image</button>

          <div className="btn-group mt-3" role="group">
            <button className="btn btn-outline-secondary" onClick={() => setZoom(1)}>Reset Zoom</button>
            <button className="btn btn-outline-secondary" onClick={() => setRotation(0)}>Reset Rotation</button>
            <button className="btn btn-outline-secondary" onClick={() => setOpacity(1)}>Reset Opacity</button>
          </div>
        </div>
      </div>

      {/* Crop Area */}
      <div className="crop-wrapper" style={{ opacity }}>
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { borderRadius: '10px', overflow: 'hidden' },
              mediaStyle: { transform: flipX ? 'scaleX(-1)' : 'scaleX(1)' }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageEditorWithMenu;
