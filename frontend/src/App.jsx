import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import FrameGenerator from './components/FrameGenerator';
import IDCardGenerator from './components/IDCardGenerator';
import ResultView from './components/ResultView';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [result, setResult] = useState(null);
  const [generationType, setGenerationType] = useState(null);

  const handleSelectFormat = (format) => {
    setGenerationType(format);
    setCurrentView(format);
  };

  const handleResult = (data) => {
    setResult(data);
    setCurrentView('result');
  };

  const handleReset = () => {
    setResult(null);
    setGenerationType(null);
    setCurrentView('landing');
  };

  const handleBack = () => {
    if (currentView === 'result') {
      setCurrentView(generationType);
      setResult(null);
    } else {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker relative overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar onHome={handleReset} showBack={currentView !== 'landing'} onBack={handleBack} />

        <main className="max-w-4xl mx-auto px-4 pb-20">
          {currentView === 'landing' && (
            <Landing onSelectFormat={handleSelectFormat} />
          )}
          {currentView === 'frame' && (
            <FrameGenerator onResult={handleResult} />
          )}
          {currentView === 'idcard' && (
            <IDCardGenerator onResult={handleResult} />
          )}
          {currentView === 'result' && result && (
            <ResultView result={result} type={generationType} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;