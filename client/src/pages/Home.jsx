// client/src/pages/Home.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import TopCoinsTable from '../components/TopCoinsTable';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for the search bar / selected coin
  const [coinIdInput, setCoinIdInput] = useState('');
  const [coinData, setCoinData]     = useState(null);
  const [headline, setHeadline]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [saved, setSaved]           = useState(false);

  // Redirect to /login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Reset when input cleared
  useEffect(() => {
    if (coinIdInput.trim() === '') {
      setCoinData(null);
      setHeadline(null);
      setSaved(false);
      setError('');
    }
  }, [coinIdInput]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = coinIdInput.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setCoinData(null);
    setHeadline(null);
    setSaved(false);

    try {
      const priceResp = await api.get(`/api/coins/search-price/${trimmed}`);
      const data = priceResp.data;
      setCoinData(data);

      const newsResp = await api.get(`/api/coins/search-news/${data.symbol}`);
      setHeadline(newsResp.data.headline);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load coin data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!coinData) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/api/coins', { coinId: coinData.coinId });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save coin');
    } finally {
      setLoading(false);
    }
  };

  // derive icon symbol
  const iconSym = coinData?.symbol?.toLowerCase();

  return (
    <div className="home-container">
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a coin (e.g. btc-bitcoin)…"
          value={coinIdInput}
          onChange={(e) => setCoinIdInput(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <button
          type="submit"
          disabled={loading || !coinIdInput.trim()}
          className="search-button"
        >
          {loading ? 'Loading…' : 'Search'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}

      {coinData && (
        <section className="coin-details-section">
          <div className="coin-details-header">
            {iconSym && (
              <img
                src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/128/color/${iconSym}.png`}
                alt={coinData.symbol}
                className="coin-logo"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <h2 className="coin-details-title">
              {coinData.name} ({coinData.symbol})
            </h2>
          </div>

          <div className="coin-cards">
            <div className="coin-card">
              <p className="card-label">Price</p>
              <p className="card-value">
                {typeof coinData.price === 'number'
                  ? `$${coinData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '–'}
              </p>
            </div>
            <div className="coin-card">
              <p className="card-label">24h Change</p>
              <p
                className="card-value"
                style={{
                  color: typeof coinData.change24h === 'number'
                    ? coinData.change24h >= 0 ? '#4ade80' : '#f87171'
                    : '#e5e7eb'
                }}
              >
                {typeof coinData.change24h === 'number'
                  ? (coinData.change24h >= 0
                      ? `▲${coinData.change24h.toFixed(2)}%`
                      : `▼${Math.abs(coinData.change24h).toFixed(2)}%`)
                  : '–'}
              </p>
            </div>
            <div className="coin-card">
              <p className="card-label">Market Cap</p>
              <p className="card-value">
                {typeof coinData.marketCap === 'number'
                  ? `$${coinData.marketCap.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  : '–'}
              </p>
            </div>
          </div>

          {!saved ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="save-button"
            >
              {loading ? 'Saving…' : 'Save to Favorites'}
            </button>
          ) : (
            <p className="saved-confirmation">Saved to your favorites! 🎉</p>
          )}

          {headline && (
            <div className="related-news">
              <h3>Related News</h3>
              <div className="news-item">
                {headline.imageUrl && <img src={headline.imageUrl} alt="news" className="news-image" />}
                <div className="news-text">
                  <h4 className="news-title">{headline.title}</h4>
                  {headline.description && <p className="news-desc">{headline.description}</p>}
                  <a href={headline.url} target="_blank" rel="noopener noreferrer" className="news-link">Read more</a>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <TopCoinsTable limit={10} />

      
      <style jsx>{`
        .home-container {
          max-width: 2000px;
          margin: 0 auto;
          padding: 1rem;
          background-color: #111827;
          min-height: 100vh;
        }

        .search-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #374151;
          border-radius: 8px;
          background-color: #1f2937;
          color: #e5e7eb;
          font-size: 1rem;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-button {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }

        .search-button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
        }

        .error-text {
          color: #f87171;
          text-align: center;
          margin-bottom: 1rem;
        }

        .coin-details-section {
          background-color: #1f2937;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
          color: #e5e7eb;
        }

        .coin-details-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .coin-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .coin-details-title {
          margin: 0;
          color: #ffffff;
          font-size: 1.5rem;
        }

        .coin-cards {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .coin-card {
          background-color: #111827;
          border: 1px solid #374151;
          border-radius: 8px;
          flex: 1;
          padding: 1rem;
          text-align: center;
        }

        .card-label {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }

        .card-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .save-button {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .save-button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
        }

        .saved-confirmation {
          margin-bottom: 1rem;
          color: #4ade80;
          font-weight: 500;
        }

        .related-news {
          margin-top: 1rem;
        }

        .related-news h3 {
          color: #e5e7eb;
          margin-bottom: 0.5rem;
        }

        .news-item {
          display: flex;
          background-color: #111827;
          border: 1px solid #374151;
          border-radius: 8px;
          overflow: hidden;
        }

        .news-image {
          width: 150px;
          object-fit: cover;
        }

        .news-text {
          padding: 0.75rem 1rem;
          flex: 1;
        }

        .news-title {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #e5e7eb;
        }

        .news-desc {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .news-link {
          color: #2563eb;
          font-size: 0.875rem;
          text-decoration: none;
        }

        .news-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .coin-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .coin-card:nth-child(3) {
            grid-column: 1 / span 2;
          }
        }
      `}</style>
    </div>
  );
}
