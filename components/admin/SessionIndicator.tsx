'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 dakika
const WARNING_TIME = 2 * 60 * 1000; // Son 2 dakikada uyarı göster

export default function SessionIndicator() {
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_TIMEOUT);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const lastActivity = sessionStorage.getItem('izorder_last_activity');
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        const remaining = SESSION_TIMEOUT - timeSinceLastActivity;
        
        setTimeLeft(Math.max(0, remaining));
        setShowWarning(remaining <= WARNING_TIME && remaining > 0);
      }
    };

    // İlk güncelleme
    updateTimer();

    // Her saniye güncelle
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    sessionStorage.setItem('izorder_last_activity', Date.now().toString());
    setShowWarning(false);
  };

  if (timeLeft <= 0) {
    return null; // Oturum sona ermiş
  }

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg transition-all duration-300 ${
      showWarning 
        ? 'bg-red-50 border-2 border-red-200 text-red-800' 
        : 'bg-blue-50 border-2 border-blue-200 text-blue-800'
    }`}>
      <div className="flex items-center space-x-2">
        {showWarning ? (
          <FaExclamationTriangle className="text-red-600" />
        ) : (
          <FaClock className="text-blue-600" />
        )}
        <div className="text-sm">
          <div className="font-medium">
            {showWarning ? 'Oturum sona eriyor!' : 'Oturum süresi'}
          </div>
          <div className="font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>
        {showWarning && (
          <button
            onClick={resetSession}
            className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Uzat
          </button>
        )}
      </div>
    </div>
  );
}
