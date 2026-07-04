import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (cookieAccepted !== 'true') {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieAccepted', 'false');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#0B1510',
      color: '#E2E8F0',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <span>This website uses cookies to enhance your experience.</span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleDecline}
          style={{
            background: 'transparent',
            border: '1px solid #61FF8B',
            color: '#61FF8B',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: '#61FF8B',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}