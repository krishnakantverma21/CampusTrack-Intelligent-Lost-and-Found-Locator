import React, { useEffect, useState } from 'react';
import { getAllItems, deleteItemById } from '../services/adminService';
import '../styles/ManageItems.css';

const ManageItemsPage = () => {
  const [items, setItems] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    getAllItems(email)
      .then(res => setItems(res.data))
      .catch(err => console.error('Failed to fetch items', err));
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const grouped = items.reduce((acc, item) => {
    const user = item.userEmail;
    if (!acc[user]) acc[user] = [];
    acc[user].push(item);
    return acc;
  }, {});

  const toggleExpand = (user) => {
    setExpandedUser(prev => (prev === user ? null : user));
    setSelectedItem(null);
  };

  const handleDelete = async (id) => {
    const email = localStorage.getItem('userEmail');
    await deleteItemById(id, email);
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  return (
    <div className="admin-panel">
      <div className="section-header gradient-header">
        <h3>📦 Manage Items</h3>
      </div>

      <div className="user-card-grid">
        {Object.entries(grouped).map(([user, userItems]) => (
          <div
            key={user}
            className="user-card"
            onClick={() => toggleExpand(user)}
          >
            <h2>👤 {user}</h2>
            <p><strong>Total Items:</strong> {userItems.length}</p>

            {expandedUser === user && !selectedItem && (
              <div className="item-name-list">
                {userItems.map(item => (
                  <p
                    key={item.id}
                    className="item-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                  >
                    🏷️ {item.name || 'Untitled'}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <>
          <div className="blur-overlay"></div>
          <div className="item-modal" onClick={() => setSelectedItem(null)}>
            <div className="item-detail-container modal-content">
              {selectedItem.imageUrl && (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="item-detail-image"
                />
              )}
              <h3>{selectedItem.name || 'Untitled'}</h3>
              <p><strong>Description:</strong> {selectedItem.description || '—'}</p>
              <p><strong>Location:</strong> {selectedItem.location || '—'}</p>
              <p><strong>Date:</strong> {formatDate(selectedItem.date)}</p>
              <p><strong>Category:</strong> {selectedItem.category || '—'}</p>
              <p><strong>Tags:</strong> {selectedItem.tags || '—'}</p>
              <p><strong>Status:</strong> {selectedItem.type || '—'}</p>
              <p><strong>Recovered:</strong> {selectedItem.recovered ? 'Yes' : 'No'}</p>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(selectedItem.id);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageItemsPage;