import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMatchedItems,
  getConfirmedMatches,
  markItemsAsMatched,
  getMatchedPairs,
} from '../services/itemService';
import '../styles/MatchResultsPage.css';

const MatchResultsPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Group matched items into pairs
  const groupIntoPairs = (items) => {
    const seen = new Set();
    const pairs = [];

    items.forEach((item) => {
      const itemId = item._id || item.id;
      const matchedId = item.matchedWith;

      if (!matchedId || seen.has(itemId) || seen.has(matchedId)) return;

      const match = items.find((i) => (i._id || i.id) === matchedId);
      if (match) {
        pairs.push([item, match]);
        seen.add(itemId);
        seen.add(matchedId);
      }
    });

    return pairs;
  };

  // 🔍 Fetch matches for a specific item or all matched pairs for the user
  const fetchMatches = async () => {
    setLoading(true);
    try {
      if (itemId) {
        const res = await getConfirmedMatches(itemId);
        setMatches(res.data.map((m) => [m])); // wrap in array for consistent rendering
      } else {
        const userEmail = localStorage.getItem('userEmail') || 'demo@example.com';
        const res = await getMatchedPairs(userEmail);
        const pairs = groupIntoPairs(res.data);
        setMatches(pairs);
      }
    } catch (err) {
      console.error('Error fetching matched items:', err);
      alert('Could not load matched items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [itemId]);

  const handleMarkAsMatched = async (matchedId) => {
    try {
      await markItemsAsMatched(itemId, matchedId);
      alert('✅ Items marked as matched!');
      fetchMatches(); // Refresh the match list
    } catch (err) {
      console.error('Error marking match:', err);
      alert('Failed to mark items. Try again.');
    }
  };

  if (loading) return <p>Loading matched items...</p>;
  if (matches.length === 0) return <p>No matched items found.</p>;

  return (
    <div className="match-results-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {itemId ? '🧩 Confirmed Match' : '🧩 Your Matched Pairs'}
      </h2>

      {matches.map((pair, index) => (
        <div key={index} className="match-pair">
          {pair.map((match) => {
            const matchId = match._id || match.id;
            return (
              <div key={matchId} className="match-card">
                {match.imageUrl && (
                  <img src={match.imageUrl} alt={match.name} className="match-image" />
                )}
                <h3>{match.name}</h3>
                <p><strong>Description:</strong> {match.description}</p>
                <p><strong>Location:</strong> {match.location}</p>
                <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>
                <p><strong>Category:</strong> {match.category}</p>
                <p><strong>Tags:</strong> {match.tags}</p>

                {!itemId && <span className="confirmed-badge">✅ Confirmed Match</span>}

                {itemId ? (
                  <button
                    onClick={() => handleMarkAsMatched(matchId)}
                    className="match-btn"
                  >
                    ✅ Mark as Matched
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/item/${matchId}`)}
                    className="match-view-btn"
                  >
                    🔍 View Full Details
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MatchResultsPage;