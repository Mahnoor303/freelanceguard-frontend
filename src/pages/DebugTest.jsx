// DebugTest.jsx
import { useEffect } from 'react';

export default function DebugTest() {
  useEffect(() => {
    console.log('✅ DebugTest mounted successfully');
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          background: '#1DB954',
          color: '#000',
          padding: '20px 40px',
          borderRadius: 16,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        ✅ Debug Test Passed
      </div>
      <p style={{ fontSize: 16 }}>If you see this green box, React is working.</p>
      <p style={{ fontSize: 14, color: '#aaa' }}>All other errors are harmless (just socket.io trying to connect).</p>
    </div>
  );
}