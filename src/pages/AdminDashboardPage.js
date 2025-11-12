import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getFlaggedPosts,
  getAnalytics,
  markFlagAsReviewed
} from '../services/adminService';
import { uploadProfileImage } from '../services/userService';
import '../styles/AdminPanel.css';

const AdminDashboardPage = () => {
  const [flags, setFlags] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImageUrl'));
  const email = localStorage.getItem('userEmail');
  const name = localStorage.getItem('userName');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [flagsRes, analyticsRes] = await Promise.all([
          getFlaggedPosts(email),
          getAnalytics(email)
        ]);
        setFlags(flagsRes.data || []);
        setAnalytics(analyticsRes.data || {});
      } catch (err) {
        console.error('Failed to load admin data', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [email]);

  const handleReview = async (flagId) => {
    try {
      await markFlagAsReviewed(flagId, email);
      setFlags(prevFlags => prevFlags.filter(f => f.id !== flagId));
    } catch (err) {
      alert('Failed to mark flag as reviewed');
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const res = await uploadProfileImage(email, formData);
      const newUrl = res.data.profileImageUrl;

      localStorage.setItem('profileImageUrl', newUrl);
      setProfileImage(newUrl);
    } catch (err) {
      alert('Failed to upload image');
      console.error(err);
    }
  };

  return (
    <div className="admin-panel">
      {/* Header with profile */}
      <div className="admin-header">
        <h2>🛠️ Admin Dashboard</h2>
        <div className="admin-profile">
          <img src={profileImage} alt="Admin" className="admin-avatar" />
          <p className="admin-name">{name}</p>
          <label className="upload-label">
            📷
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          {/* Platform Analytics */}
          <section className="analytics-section">
            <div className="section-header gradient-header">
              <h3>📊 Platform Analytics</h3>
            </div>
            <div className="analytics-grid">
              <div className="analytics-card">📝 Items Reported: {analytics.itemsReported}</div>
              <div className="analytics-card">🔍 Items Matched: {analytics.itemsMatched}</div>
              <div className="analytics-card">🎯 Items Recovered: {analytics.itemsRecovered}</div>
              <div className="analytics-card">👥 Active Users: {analytics.activeUsers}</div>
              <div className="analytics-card">💬 Message Volume: {analytics.messageVolume}</div>
            </div>
          </section>

          {/* Admin Tools */}
          <section className="admin-links-section">
            <div className="section-header gradient-header">
              <h3>🧭 Admin Tools</h3>
            </div>
            <div className="admin-tools-grid">
              <Link to="/admin/users" className="admin-tool-btn">👥 Manage Users</Link>
              <Link to="/admin/items" className="admin-tool-btn">📦 Manage Items</Link>
              <Link to="/admin/messages" className="admin-tool-btn">💬 Manage Messages</Link>
            </div>
          </section>

          {/* Flagged Posts */}
          <section className="flagged-section">
            <h3>🚩 Flagged Posts</h3>
            {flags.length === 0 ? (
              <p>No flagged posts.</p>
            ) : (
              flags.map(flag => (
                <div key={flag.id} className="flag-card">
                  <h4>{flag.itemTitle}</h4>
                  <p><strong>Reason:</strong> {flag.reason}</p>
                  <p><strong>Reported By:</strong> {flag.reportedBy}</p>
                  <button onClick={() => handleReview(flag.id)}>✅ Mark as Reviewed</button>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;