// client/src/pages/SavedCoins.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import CoinCard from '../components/CoinCard'; 
import LoadingSpinner from '../components/LoadingSpinner';

export default function SavedCoins() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [coins, setCoins]   = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [newCoin, setNewCoin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [searchError, setSearchError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    // If only whitespace), reset the "Coin Details" state
    if (filter.trim() === '') {
      fetchSavedCoins();
      setSearchError('');
    }
  }, [filter]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const trimmed = filter.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearchError('');
    try {
      const res = await api.get('/api/coins', {
        params: {
          filter: trimmed,
          sortBy: sortBy || undefined
        }
      });
      if (res.data.length === 0) {
        setSearchError(`Coin not found for "${trimmed}"`);
      } else {
        setSearchError('');
      }
      // Always fetch and show all favorites below
      await fetchSavedCoins();
    } catch (err) {
      setSearchError('Failed to search for coin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCoins = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/coins', {
          params: {
            filter: filter || undefined,
            sortBy: sortBy || undefined
          }
        });
        setCoins(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          console.error(err);
          setError('Failed to fetch saved coins.');
        }
      } finally {
        setLoading(false);
      }
  };

  // Fetch saved coins whenever filter or sortBy changes
  useEffect(() => {
    if (!token) return;

    fetchSavedCoins();
  }, [token, sortBy, logout, navigate]);

  // Handler for "Explore Coins" button when no favorites
  const handleExplore = () => {
    navigate('/');
  };

  // Refresh one coin
  const handleRefresh = async (id) => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/api/coins/${id}`, {}, { params: { refresh: true } });
      // re‐fetch
      const res = await api.get('/api/coins', {
        params: { filter: filter || undefined, sortBy: sortBy || undefined }
      });
      setCoins(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to refresh coin.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete one coin
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/api/coins/${id}`);
      // re‐fetch
      const res = await api.get('/api/coins', {
        params: { filter: filter || undefined, sortBy: sortBy || undefined }
      });
      setCoins(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete coin.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  function handleSaveNote(id, newNotes) {
  console.log("Saving note:", { id, newNotes });
  setLoading(true);
  setError('');
  api.put(`/api/coins/${id}`, { notes: newNotes })
    .then((res) => {
      console.log("API response:", res.data);
      setCoins(coins.map((c) => (c._id === id ? res.data : c)));
      alert("Successfully saved the notes");
    })
    .catch((err) => {
      console.error(err);
      setError('Failed to save note.');
    })
    .finally(() => setLoading(false));
}


  return (
    <div className="saved-coins-page">
      <h1 className="page-title">Favorites</h1>

 
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a coin…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <button
          type="submit"
          disabled={loading || !filter.trim()}
          className="search-button"
        >
          {loading ? 'Loading…' : 'Search'}
        </button>
      </form>

 
      {error && <p className="error-text">{error}</p>}
      {searchError && <p className="error-text">{searchError}</p>}
      {loading && <LoadingSpinner />}


      {coins.length === 0 && !loading && !searchError && (
        <div className="empty-state">      
          <h2 className="empty-title">No favorites yet</h2>
          <p className="empty-text">
            Add coins to your favorites to track their performance and stay updated on their latest news.
          </p>
          <button className="explore-button" onClick={handleExplore}>
            Explore Coins
          </button>
        </div>
      )}


      {coins.length > 0 && (
        <div className="coins-grid">
          {coins.map((coin) => (
            <CoinCard
              key={coin._id}
              coin={coin}
              onRefresh={handleRefresh}
              onDelete={handleDelete}
              onSaveNote={handleSaveNote}
            />
          ))}
        </div>
      )}

      <style jsx>{`

        .saved-coins-page {
          min-height: 100vh;
          background-color: #111827;
          color: #e5e7eb;
          padding: 1rem;
        }
        .page-title {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: #ffffff;
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

 
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
        }
        .empty-placeholder-box {
          width: 240px;
          height: 120px;
          background-color: #374151;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .empty-title {
          font-size: 1.5rem;
          margin: 0.5rem 0;
          color: #ffffff;
        }
        .empty-text {
          font-size: 1rem;
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }
        .explore-button {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        .explore-button:hover {
          background-color: #1e40af;
        }

    
       .coins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 0.5rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1rem;
          box-sizing: border-box;
        }

      
        .error-text {
          color: #f87171;
          text-align: center;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .coins-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            padding: 0 0.5rem;
            box-sizing: border-box;
          }
          .coin-card {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
          }
          .actions {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .action-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
