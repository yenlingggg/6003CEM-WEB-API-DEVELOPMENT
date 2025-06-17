// client/src/components/CoinCard.jsx
import React, { useState } from 'react';
import './CoinCard.css';

export default function CoinCard({ coin, onRefresh, onDelete, onSaveNote }) {
  const [noteText, setNoteText]     = useState(coin.notes || '');
  const [savingNote, setSavingNote] = useState(false);
  const [noteError, setNoteError]   = useState('');

  
  const sym = (coin.symbol || coin.coinId.split('-')[0]).toLowerCase();

 
  const handleNoteSave = async () => {
    setSavingNote(true);
    setNoteError('');
    try {
      await onSaveNote(coin._id, noteText);
    } catch (err) {
      console.error('Save note error:', err);
      setNoteError('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="coin-card">
      <div className="coin-header">
       {sym && (
         <img
           src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/128/color/${sym}.png`}
           alt={sym}
           className="coin-logo"
           onError={e => (e.currentTarget.style.display = 'none')}
         />
       )}
      <h3 className="coin-name">{coin.name}</h3>
     </div>
      <p className="coin-price">Price (USD): ${coin.price.toLocaleString()}</p>
      <p className="coin-marketcap">Market Cap: ${coin.marketCap.toLocaleString()}</p>
      <p className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
        24h Change: {coin.change24h.toFixed(2)}%
      </p>

      {coin.headline && (
        <div className="headline">
          <h4>{coin.headline.title}</h4>
          <a
            href={coin.headline.url}
            target="_blank"
            rel="noreferrer"
            className="headline-link"
          >
            Read more
          </a>
        </div>
      )}

      <div className="notes-section">
        <textarea
          className="notes-input"
          rows={3}
          placeholder="Add personal notes..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        {noteError && <p className="note-error-text">{noteError}</p>}
        <button
          className="action-btn"
          onClick={handleNoteSave}
          disabled={savingNote}
        >
          {savingNote ? 'Saving...' : 'Save Note'}
        </button>
      </div>

      <div className="actions">
        <button className="action-btn" onClick={() => onRefresh(coin._id)}>
          Refresh
        </button>
        <button className="action-btn delete" onClick={() => onDelete(coin._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
