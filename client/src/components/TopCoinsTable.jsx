// client/src/components/TopCoinsTable.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import io from 'socket.io-client';

export default function TopCoinsTable({ limit = 10 }) {
  const [coins, setCoins]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    // Initial fetch
    api.get(`/api/coins/top?limit=${limit}`)
      .then(res => setCoins(res.data.coins || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load top coins.'))
      .finally(() => setLoading(false));

    // Live updates via socket.io
    const socket = io('https://six003cem-crypto-server.onrender.com/');
    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err);
      setError('Live updates unavailable.');
    });
    socket.on('topCoins', (liveCoins) => {
      setCoins(liveCoins);
    });

    return () => socket.disconnect();
  }, [limit]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '1rem' }}>
        {error}
      </p>
    );
  }

  return (
    <div className="top-coins-container">
      <h2 className="table-title">Top {limit} Cryptocurrencies</h2>
      <div className="table-wrapper">
        <table className="top-coins-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price&nbsp;(USD)</th>
              <th>24h Change</th>
              <th>Market Cap&nbsp;(USD)</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              // derive symbol for icon
              const sym = coin.symbol?.toLowerCase();
              const hasValidPrice = typeof coin.price === 'number';
              const hasValidCap   = typeof coin.marketCap === 'number';
              const formattedPrice = hasValidPrice
                ? `$${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '–';
              const formattedChange = typeof coin.change24h === 'number'
                ? (coin.change24h >= 0 ? `▲${coin.change24h.toFixed(2)}%` : `▼${Math.abs(coin.change24h).toFixed(2)}%`)
                : '–';
              const changeColor = typeof coin.change24h === 'number'
                ? (coin.change24h >= 0 ? '#4ade80' : '#f87171')
                : '#e5e7eb';
              const formattedCap = hasValidCap
                ? `$${coin.marketCap.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : '–';

              return (
                <tr key={coin.id}>
                  <td>{coin.rank ?? '–'}</td>
                  <td>
                    <div className="name-cell">
                      {sym && (
                        <img
                          src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/128/color/${sym}.png`}
                          alt={coin.symbol}
                          className="table-logo"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <strong>{coin.name ?? 'Unknown'}</strong>
                      <span className="table-symbol"> · {coin.symbol ?? 'N/A'}</span>
                    </div>
                  </td>
                  <td>{formattedPrice}</td>
                  <td style={{ color: changeColor }}>{formattedChange}</td>
                  <td>{formattedCap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .top-coins-container {
          margin: 2rem 0;
        }
        .table-title {
          color: #e5e7eb;
          margin-bottom: 0.5rem;
        }
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -1rem;
          padding: 0 1rem;
        }
        .top-coins-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
          background-color: #1f2937;
          border-radius: 8px;
          overflow: hidden;
        }
        .top-coins-table th,
        .top-coins-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #374151;
          color: #e5e7eb;
          text-align: left;
        }
        .top-coins-table th {
          background-color: #111827;
          font-weight: 600;
        }
        .top-coins-table tr:hover {
          background-color: #374151;
        }
        .name-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .table-logo {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }
        .table-symbol {
          font-weight: 400;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
