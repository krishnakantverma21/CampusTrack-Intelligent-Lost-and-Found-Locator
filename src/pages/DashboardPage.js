import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLostItems, getFoundItems } from '../services/itemService';
import { getUnseenMessages, sendChatRequest } from '../services/chatService';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('lost');
  const [notifications, setNotifications] = useState([]);
  const [showHeaderActions, setShowHeaderActions] = useState(true);

  const navigate = useNavigate();

  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Guest');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [profileImageUrl, setProfileImageUrl] = useState(
    localStorage.getItem('profileImageUrl') || '/assets/default-profile.png'
  );

  useEffect(() => {
    getLostItems().then(res => setLostItems(res.data));
    getFoundItems().then(res => setFoundItems(res.data));
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getUnseenMessages(userEmail);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userEmail) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await fetch(`http://localhost:8088/api/auth/${userEmail}/profile-image`, {
        method: 'PATCH',
        body: formData,
      });
      const data = await res.json();
      if (data.profileImageUrl) {
        setProfileImageUrl(data.profileImageUrl);
        localStorage.setItem('profileImageUrl', data.profileImageUrl);
      }
    } catch (err) {
      alert('Failed to upload image');
      console.error(err);
    }
  };

  const filterItems = (items) =>
    items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())
    );

  const displayedItems = activeTab === 'lost' ? filterItems(lostItems) : filterItems(foundItems);

  const handleChatRequest = async (itemId, receiverEmail) => {
    if (!userEmail || !receiverEmail || userEmail === receiverEmail) {
      alert("Invalid chat request");
      return;
    }

    try {
      await sendChatRequest({
        senderEmail: userEmail,
        receiverEmail,
        itemId,
        status: 'pending'
      });
      alert("Chat request sent!");
    } catch (err) {
      console.error("Failed to send chat request", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>🎓 CampusTrack</h1>
        <p className="tagline">Lost it? Find it. Found it? Share it.</p>

        <div className="profile-dropdown">
          <img src={profileImageUrl} alt="Profile" className="profile-pic" />
          <div className="dropdown-content">
            <p><strong>{userName}</strong></p>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        </div>
      </header>

      {notifications.length > 0 && (
        <div className="notification-bar">
          <p>📨 You have {notifications.length} new message(s)</p>
          <button onClick={() => navigate('/chat-center')}>Open Chat Center</button>
        </div>
      )}

      {/* ✅ Glowing Header with Toggleable Actions */}
      <div className="glowing-header">
        <div className="header-toggle" onClick={() => setShowHeaderActions(!showHeaderActions)}>
          {showHeaderActions ? '▲ Hide Actions' : '▼ Show Actions'}
        </div>

        {showHeaderActions && (
          <div className="header-actions">
            <button onClick={() => navigate('/chat-center')}>💬 Chat Requests</button>
            <button onClick={() => navigate('/submit?type=lost')}>📦 Submit Lost Item</button>
            <button onClick={() => navigate('/submit?type=found')}>🎒 Submit Found Item</button>
            <button onClick={() => navigate('/matches')}>🧩 View Matched Items</button>
            <button onClick={() => navigate('/chat-center')}>💬 Go to Chat Center</button>
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or location"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="tab-toggle">
        <button
          className={`tab ${activeTab === 'lost' ? 'active' : ''}`}
          onClick={() => setActiveTab('lost')}
        >
          Lost Items
        </button>
        <button
          className={`tab ${activeTab === 'found' ? 'active' : ''}`}
          onClick={() => setActiveTab('found')}
        >
          Found Items
        </button>
      </div>

      <div className="item-grid fade-in">
        {displayedItems.map(item => {
          const itemId = item._id || item.id;
          const submitterEmail = item.userEmail || item.submitterEmail;

          return (
            <div
              className="item-card glass"
              key={itemId}
              onClick={() => navigate(`/item/${itemId}`)}
              style={{ cursor: 'pointer' }}
            >
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="item-image" />
              )}
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><strong>📍 Location:</strong> {item.location}</p>
              <p><strong>📅 Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              {item.category && <p><strong>📁 Category:</strong> {item.category}</p>}
              {item.tags && <p><strong>🏷️ Tags:</strong> {item.tags}</p>}

              <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                <button className="claim-btn">Claim</button>
                <button
                  className="chat-btn"
                  onClick={() => handleChatRequest(itemId, submitterEmail)}
                >
                  Chat
                </button>
                <button className="match-btn" onClick={() => navigate(`/matches/${itemId}`)}>
                  🔍 View Matches
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;