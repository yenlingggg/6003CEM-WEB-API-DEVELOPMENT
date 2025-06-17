// client/src/pages/News.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';               // axios instance pointed to /api
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
                       

export default function News() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);   // will hold an array of news objects
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // On mount: fetch the top crypto headlines from our backend
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/api/news/top');
        // We expect: { articles: [ { title, description, url, imageUrl, publishedAt }, … ] }
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        if (err.response?.status === 401) {
          // If unauthorized, force logout
          logout();
          navigate('/login');
        } else {
          setError('Failed to load latest news.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [token, logout, navigate]);

  return (
    <div className="news-container">
      <h1 className="news-title">Latest Crypto News</h1>

      {loading && <LoadingSpinner />}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="articles-list">
          {articles.length === 0 ? (
            <p className="no-articles">No news articles found.</p>
          ) : (
            articles.map((a, idx) => (
              <div key={idx} className="article-card">
                {a.imageUrl && (
                  <div className="article-image-wrapper">
                    <img src={a.imageUrl} alt="News" className="article-image" />
                  </div>
                )}
                <div className="article-content">
                  <h2 className="article-title">{a.title}</h2>
                  {a.description && <p className="article-description">{a.description}</p>}
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read more
                  </a>
                  {a.publishedAt && (
                    <p className="article-date">
                      {new Date(a.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .news-container {
          max-width:2000px;
          margin: 0 auto;
          padding: 1rem;
          background-color: #111827;
          color: #e5e7eb;
          min-height: 100vh;
        }
        .news-title {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #ffffff;
        }
        .error-text {
          color: #f87171;
          text-align: center;
          margin-bottom: 1rem;
        }
        .no-articles {
          text-align: center;
          color: #9ca3af;
          margin-top: 2rem;
        }
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .article-card {
          display: flex;
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          overflow: hidden;
        }
        .article-image-wrapper {
          flex: 0 0 150px;
        }
        .article-image {
          width: 150px;
          height: 100%;
          object-fit: cover;
        }
        .article-content {
          padding: 1rem;
          flex: 1;
        }
        .article-title {
          margin: 0;
          color: #ffffff;
          font-size: 1.125rem;
        }
        .article-description {
          margin: 0.5rem 0;
          color: #9ca3af;
          font-size: 0.95rem;
        }
        .read-more {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .read-more:hover {
          text-decoration: underline;
        }
        .article-date {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
