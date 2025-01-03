import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom'
import HomePage from "./pages/HomePage";
import NotFound from "./components/NotFound";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      toast((t) => (
        <div>
          <p>Install our app for a better experience!</p>
          <button
            onClick={() => {
              handleInstallClick();
              toast.dismiss(t.id);
            }}
          >
            Install Now
          </button>
        </div>
      ), {
        duration: 6000,
        position: 'bottom-center',
      });
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        toast.success('App installed successfully!');
      }
    }
  };

  useEffect(() => {
    if (isIOS) {
      toast((t) => (
        <div>
          <p>
            To install on iOS: tap share button <span role="img" aria-label="share">⬆️</span> 
            then "Add to Home Screen" <span role="img" aria-label="plus">➕</span>
          </p>
        </div>
      ), {
        duration: 6000,
        position: 'bottom-center',
      });
    }
  }, [isIOS]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
