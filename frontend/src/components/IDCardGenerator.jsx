import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PhotoUpload from './PhotoUpload';
import { HiSparkles } from 'react-icons/hi2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STACK_OPTIONS = [
  'Full Stack', 'Frontend', 'Backend', 'Mobile', 'DevOps',
  'AI/ML', 'Blockchain', 'Cloud', 'Data Science', 'Security',
  'Game Dev', 'IoT', 'AR/VR', 'Other'
];

function IDCardGenerator({ onResult }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [stack, setStack] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhotoSelect = (file) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!photo) {
      toast.error('Please upload a photo');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('name', name.trim());
    formData.append('role', role.trim() || 'Builder');
    formData.append('stack', stack || 'Full Stack');

    try {
      const response = await axios.post(`${API_URL}/api/generate/idcard`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      if (response.data.success) {
        onResult(response.data);
        toast.success('Builder ID created! 🎉');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate ID card. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 md:pt-10 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black mb-2">
          Builder <span className="gradient-text">ID Card</span>
        </h2>
        <p className="text-white/50 text-sm">
          Create your personalized event badge with a fun builder title
        </p>
      </div>

      <div className="card-glass space-y-5">
        {/* Photo Upload - Single instance */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Your Photo *
          </label>
          <PhotoUpload onPhotoSelect={handlePhotoSelect} preview={preview} />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="input-field"
            maxLength={30}
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Role / Title
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Frontend Developer"
            className="input-field"
            maxLength={30}
          />
        </div>

        {/* Stack */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Stack
          </label>
          <div className="flex flex-wrap gap-2">
            {STACK_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStack(s)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${stack === s
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!photo || !name.trim() || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-lg mt-6"
      >
        {loading ? (
          <>
            <div className="spinner !w-5 !h-5"></div>
            Creating your badge...
          </>
        ) : (
          <>
            <HiSparkles className="w-5 h-5" />
            Generate Builder ID
          </>
        )}
      </button>
    </div>
  );
}

export default IDCardGenerator;