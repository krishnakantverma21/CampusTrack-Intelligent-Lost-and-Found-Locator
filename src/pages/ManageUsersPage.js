import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  getAllItems,
  getAllMessages,
  deleteItemById,
  deleteMessageById,
  deleteUserByEmail
} from '../services/adminService';
import '../styles/ManageUsers.css';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [viewMode, setViewMode] = useState(null); // 'items' or 'messages'
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    getAllUsers(email).then(res => setUsers(res.data));
    getAllItems(email).then(res => setItems(res.data));
    getAllMessages(email).then(res => setMessages(res.data));
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const handleDeleteUser = async (targetEmail) => {
    const adminEmail = localStorage.getItem('userEmail');
    if (window.confirm(`Delete user ${targetEmail}?`)) {
      await deleteUserByEmail(targetEmail, adminEmail);
      setUsers(prev => prev.filter(u => u.email !== targetEmail));
    }
  };

  const handleDeleteItem = async (id) => {
    const email = localStorage.getItem('userEmail');
    await deleteItemById(id, email);
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const handleDeleteMessage = async (id) => {
    const email = localStorage.getItem('userEmail');
    await deleteMessageById(id, email);
    setMessages(prev => prev.filter(msg => msg.id !== id));
    setSelectedMessage(null);
  };

  const userItems = (email) => items.filter(item => item.userEmail === email);
  const userMessages = (email) => messages.filter(msg => msg.senderEmail === email);

  return (
    <div className="admin-panel">
      <div className="section-header gradient-header">
        <h3>👥 Manage Users</h3>
      </div>

      <div className="user-card-grid">
        {users.map(user => (
          <div
            key={user.email}
            className="user-card"
            onClick={() => {
              setExpandedUser(user.email === expandedUser ? null : user.email);
              setViewMode(null);
              setSelectedItem(null);
              setSelectedMessage(null);
            }}
          >
            <img
              src={user.profileImageUrl || '/default-avatar.png'}
              alt={user.name}
              className="user-avatar"
            />
            <h2>{user.name || 'Unnamed User'}</h2>
            <p>{user.email}</p>

            {expandedUser === user.email && !selectedItem && !selectedMessage && (
              <div className="user-options">
                <button onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('items');
                }}>📦 Items</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('messages');
                }}>💬 Messages</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user.email);
                }}>🗑️ Delete User</button>
              </div>
            )}

            {expandedUser === user.email && viewMode === 'items' && !selectedItem && (
              <div className="item-name-list">
                {userItems(user.email).map(item => (
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

            {expandedUser === user.email && viewMode === 'messages' && !selectedMessage && (
              <div className="message-name-list">
                {userMessages(user.email).map((msg, index) => (
                  <p
                    key={index}
                    className="message-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(msg);
                    }}
                  >
                    🗂️ To {msg.receiverEmail} — {formatDate(msg.timestamp)}
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
                <img src={selectedItem.imageUrl} alt={selectedItem.name} className="item-detail-image" />
              )}
              <h3>{selectedItem.name || 'Untitled'}</h3>
              <p><strong>Description:</strong> {selectedItem.description || '—'}</p>
              <p><strong>Location:</strong> {selectedItem.location || '—'}</p>
              <p><strong>Date:</strong> {formatDate(selectedItem.date)}</p>
              <p><strong>Category:</strong> {selectedItem.category || '—'}</p>
              <p><strong>Tags:</strong> {selectedItem.tags || '—'}</p>
              <p><strong>Status:</strong> {selectedItem.type || '—'}</p>
              <p><strong>Recovered:</strong> {selectedItem.recovered ? 'Yes' : 'No'}</p>
              <button className="edit-btn" onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(selectedItem.id);
              }}>🗑️ Delete</button>
            </div>
          </div>
        </>
      )}

      {selectedMessage && (
        <>
          <div className="blur-overlay"></div>
          <div className="message-modal" onClick={() => setSelectedMessage(null)}>
            <div className="message-detail-container modal-content">
              <h3>{selectedMessage.type === 'image' ? '🖼️ Image Message' :
                   selectedMessage.type === 'audio' ? '🎧 Audio Message' :
                   '💬 Text Message'}</h3>
              <p><strong>From:</strong> {selectedMessage.senderEmail}</p>
              <p><strong>To:</strong> {selectedMessage.receiverEmail}</p>
              <p><strong>Time:</strong> {formatDate(selectedMessage.timestamp)}</p>
              <p><strong>Type:</strong> {selectedMessage.type}</p>
              <p><strong>Content:</strong> {selectedMessage.content || '—'}</p>
              {selectedMessage.filename && (
                <p><strong>File:</strong> {selectedMessage.filename}</p>
              )}
              <p><strong>Seen:</strong> {selectedMessage.seen ? 'Yes' : 'No'}</p>
              <button className="edit-btn" onClick={(e) => {
                e.stopPropagation();
                handleDeleteMessage(selectedMessage.id);
              }}>🗑️ Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsersPage;