import React from 'react';
import { HiCamera, HiIdentification, HiSparkles } from 'react-icons/hi2';

function Landing({ onSelectFormat }) {
  return (
    <div className="pt-8 md:pt-16 animate-fadeIn">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 mb-6 border border-white/10">
          <span className="text-sm">🌴</span>
          <span className="text-xs font-semibold text-brand-accent tracking-wider uppercase">
            Headout Hackathon
          </span>
          <span className="text-sm">🏖️</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
          <span className="gradient-text">HH Goa 2026</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-lg mx-auto leading-relaxed">
          Generate your branded profile frame or builder ID card.
          <br className="hidden md:block" />
          Share it on X. Claim your spot.
        </p>
      </div>

      {/* Format Selection */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
        {/* PFP Frame Card */}
        <button
          onClick={() => onSelectFormat('frame')}
          className="group card-glass hover:bg-white/10 transition-all duration-300 text-left
            hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/10 active:scale-[0.98]"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent
              flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <HiCamera className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-white group-hover:text-brand-accent transition-colors">
                PFP Frame
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Wrap your photo in a branded circular frame. Perfect for your X profile picture.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-brand-primary text-sm font-semibold">
            <HiSparkles className="w-4 h-4" />
            Upload & Generate
          </div>
        </button>

        {/* Builder ID Card */}
        <button
          onClick={() => onSelectFormat('idcard')}
          className="group card-glass hover:bg-white/10 transition-all duration-300 text-left
            hover:border-brand-teal/30 hover:shadow-lg hover:shadow-brand-teal/10 active:scale-[0.98]"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-teal to-brand-secondary
              flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <HiIdentification className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-white group-hover:text-brand-teal transition-colors">
                Builder ID Card
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Get a custom event badge with your photo, name, stack, and a generated builder title.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-brand-teal text-sm font-semibold">
            <HiSparkles className="w-4 h-4" />
            Create Your Badge
          </div>
        </button>
      </div>

      {/* Features */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-white/30">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          No sign-up required
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
          Instant generation
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
          Download & share
        </div>
      </div>
    </div>
  );
}

export default Landing;