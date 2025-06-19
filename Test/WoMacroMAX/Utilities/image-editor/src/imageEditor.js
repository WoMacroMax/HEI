import React, { useRef, useState } from 'react';

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState('Waiting for upload...');
  const [fileInfo, setFileInfo] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus('Loading...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setFileInfo(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        drawImage(img, 0, false);
        setStatus('✅ Loaded locally.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImage = (img, angle, isFlipped) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = img.width;
    const h = img.height;

    const rotated = angle % 180 !== 0;
    canvas.width = rotated ? h : w;
    canvas.height = rotated ? w : h;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(isFlipped ? -1 : 1, 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  };

  const handleRotate = () => {
    if (!originalImage) return;
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    drawImage(originalImage, newRotation, flipped);
  };

  const handleFlip = () => {
    if (!originalImage) return;
    const newFlip = !flipped;
    setFlipped(newFlip);
    drawImage(originalImage, rotation, newFlip);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'edited-image.png';
      a.click();
      setStatus('✅ Image saved locally.');
    }, 'image/png');
  };

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">WoMacroMAX React Image Editor</h2>
      <input type="file" accept="image/*" onChange={handleUpload} className="form-control w-50 mx-auto mb-3" />
      <p className="text-muted">{status}</p>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: '8px' }}></canvas>
      <div className="my-3">
        <button className="btn btn-secondary mx-1" onClick={handleRotate}>Rotate</button>
        <button className="btn btn-secondary mx-1" onClick={handleFlip}>Flip</button>
        <button className="btn btn-success mx-1" onClick={handleSave}>Save</button>
      </div>
      <p className="text-muted">{fileInfo}</p>
    </div>
  );
};

export default ImageEditor;
