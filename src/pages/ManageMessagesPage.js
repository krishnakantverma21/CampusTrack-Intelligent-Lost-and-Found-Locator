import React, { useEffect, useState } from 'react';
import { getAllMessages, deleteMessageById } from '../services/adminService';
import '../styles/ManageMessages.css';

const ManageMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [expandedSender, setExpandedSender] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, message: null });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    getAllMessages(email)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Failed to fetch messages', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const grouped = messages.reduce((acc, msg) => {
    const sender = msg.senderEmail;
    if (!acc[sender]) acc[sender] = [];
    acc[sender].push(msg);
    return acc;
  }, {});

  const toggleExpand = (sender) => {
    setExpandedSender(prev => (prev === sender ? null : sender));
  };

  const handleDelete = async (id) => {
    const email = localStorage.getItem('userEmail');
    await deleteMessageById(id, email);
    setMessages(prev => prev.filter(msg => msg.id !== id));
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleEdit = (message) => {
    alert(`Edit message:\n${message.content}`);
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div className="admin-panel">
      <div className="section-header gradient-header">
        <h3>💬 Manage Messages</h3>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="message-card-grid">
          {Object.entries(grouped).map(([sender, msgs]) => (
            <div
              key={sender}
              className="message-card"
              onClick={() => toggleExpand(sender)}
            >
              <h2>📨 {sender}</h2>
              <p><strong>Total Messages:</strong> {msgs.length}</p>

              {expandedSender === sender && (
                <div className="message-details">
                  {msgs.map((msg, index) => (
                    <div
                      key={index}
                      className="message-entry"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          visible: true,
                          x: e.pageX,
                          y: e.pageY,
                          message: msg
                        });
                      }}
                    >
                      <p><strong>To:</strong> {msg.receiverEmail}</p>
                      <p><strong>Time:</strong> {formatDate(msg.timestamp)}</p>
                      <p><strong>Type:</strong> {msg.type}</p>
                      <p><strong>Content:</strong> {msg.content || '—'}</p>
                      {msg.filename && <p><strong>File:</strong> {msg.filename}</p>}
                      <hr />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {contextMenu.visible && (
        <ul
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li onClick={() => handleDelete(contextMenu.message.id)}>🗑️ Delete</li>
          <li onClick={() => handleEdit(contextMenu.message)}>✏️ Edit</li>
        </ul>
      )}
    </div>
  );
};

export default ManageMessagesPage;