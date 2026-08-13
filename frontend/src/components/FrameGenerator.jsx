import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PhotoUpload from './PhotoUpload';
import { HiSparkles } from 'react-icons/hi2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function FrameGenerator({ onResult }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoSelect = (file) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!photo) {
      toast.error('Please upload a photo first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const response = await axios.post(`${API_URL}/api/generate/frame`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      if (response.data.success) {
        onResult(response.data);
        toast.success('Frame generated! 🎉');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate frame. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 md:pt-10 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black mb-2">
          PFP Frame <span className="gradient-text">Generator</span>
        </h2>
        <p className="text-white/50 text-sm">
          Upload your photo and get a branded HH Goa 2026 profile frame
        </p>
      </div>

      <div className="card-glass mb-6">
        <PhotoUpload onPhotoSelect={handlePhotoSelect} preview={preview} />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!photo || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
      >
        {loading ? (
          <>
            <div className="spinner !w-5 !h-5"></div>
            Generating...
          </>
        ) : (
          <>
            <HiSparkles className="w-5 h-5" />
            Generate Frame
          </>
        )}
      </button>
    </div>
  );
}

export default FrameGenerator;