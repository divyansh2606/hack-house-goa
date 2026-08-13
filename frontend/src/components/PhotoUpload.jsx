import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiCloudArrowUp, HiPhoto } from 'react-icons/hi2';

function PhotoUpload({ onPhotoSelect, preview, compact = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onPhotoSelect(file);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  if (preview && compact) {
    return (
      <div className="relative">
        <div
          {...getRootProps()}
          className="cursor-pointer group"
        >
          <input {...getInputProps()} />
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-brand-primary/50 transition-colors">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs font-semibold">Change</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDragActive
          ? 'border-brand-primary bg-brand-primary/10 scale-[1.02]'
          : preview
            ? 'border-white/20 bg-white/5'
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }
        ${preview ? 'p-4' : 'p-8 md:p-12'}
      `}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-2xl overflow-hidden border border-white/10">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-white/40">Click or drag to change photo</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            ${isDragActive ? 'bg-brand-primary/20' : 'bg-white/5'}
            transition-colors
          `}>
            {isDragActive ? (
              <HiCloudArrowUp className="w-8 h-8 text-brand-primary animate-bounce" />
            ) : (
              <HiPhoto className="w-8 h-8 text-white/40" />
            )}
          </div>
          <div>
            <p className="font-semibold text-white/80 mb-1">
              {isDragActive ? 'Drop your photo here' : 'Upload your photo'}
            </p>
            <p className="text-sm text-white/40">
              JPG, PNG, HEIC, WebP • Max 20MB
            </p>
          </div>
          <button
            type="button"
            className="mt-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-semibold transition-colors"
          >
            Choose File
          </button>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;