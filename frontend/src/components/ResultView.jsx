import React, { useState } from 'react';
import { HiArrowDownTray, HiArrowPath, HiCheckCircle } from 'react-icons/hi2';
import { FaXTwitter } from 'react-icons/fa6';

function ResultView({ result, type, onReset }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'frame' ? 'hh-goa-2026-frame.png' : 'hh-goa-2026-builder-id.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab
      window.open(result.imageUrl, '_blank');
    }
  };

  const handleShareToX = () => {
    const caption = type === 'frame'
      ? `Just got my HH Goa 2026 profile frame! 🌴🏖️ See you in Goa! #FrameInGoa #HHGoa2026`
      : `Just claimed my Builder ID for HH Goa 2026! 🚀🌴 Ready to build in Goa! #FrameInGoa #HHGoa2026`;

    const shareUrl = result.shareUrl;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="pt-6 md:pt-10 max-w-lg mx-auto">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2 mb-4 border border-green-500/20">
          <HiCheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold text-green-400">
            {type === 'frame' ? 'Frame Ready!' : 'Builder ID Created!'}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black">
          Your <span className="gradient-text">{type === 'frame' ? 'Frame' : 'Builder ID'}</span> is ready
        </h2>
      </div>

      {/* Image preview */}
      <div className="card-glass mb-6 flex justify-center">
        <div className="relative">
          {!imageLoaded && (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          )}
          <img
            src={result.imageUrl}
            alt={type === 'frame' ? 'Your HH Goa 2026 Frame' : 'Your Builder ID Card'}
            onLoad={() => setImageLoaded(true)}
            className={`
              max-w-full rounded-xl shadow-2xl
              ${type === 'frame' ? 'max-h-[400px]' : 'max-h-[350px]'}
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              transition-opacity duration-300
            `}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <HiArrowDownTray className="w-5 h-5" />
          Download Image
        </button>

        <button
          onClick={handleShareToX}
          className="btn-twitter w-full justify-center"
        >
          <FaXTwitter className="w-5 h-5" />
          Share on X
        </button>

        <button
          onClick={onReset}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <HiArrowPath className="w-5 h-5" />
          Create Another
        </button>
      </div>

      {/* Tip */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/30">
          💡 Tip: Download the image first, then attach it manually to your tweet for best quality
        </p>
      </div>
    </div>
  );
}

export default ResultView;