// client/src/components/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={styles.overlay}>
      <div className="lds-dual-ring"></div>
      <style>{`
        .lds-dual-ring { 
          display: inline-block;
          width: 64px;
          height: 64px;
        }
        .lds-dual-ring:after {
          content: " ";
          display: block;
          width: 46px;
          height: 46px;
          margin: 1px;
          border-radius: 50%;
          border: 5px solid #0e3d72;
          border-color: #0e3d72 transparent #0e3d72 transparent;
          animation: lds-dual-ring 1.2s linear infinite;
        }
        @keyframes lds-dual-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // light dim background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

