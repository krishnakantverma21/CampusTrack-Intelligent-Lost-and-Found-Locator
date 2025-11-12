import React, { useEffect, useState } from 'react';
import { getPendingRequests, respondToChatRequest } from '../services/chatService';
import '../styles/ChatRequests.css';

const ChatRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await getPendingRequests(userEmail);
      setRequests(res.data || []);
    };
    fetchRequests();
  }, [userEmail]);

  const handleResponse = async (id, action) => {
    await respondToChatRequest(id, action);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="chat-requests-panel">
      <h3>🔔 Chat Requests</h3>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map(req => (
          <div key={req.id} className="chat-request-card">
            <p>💬 From: {req.senderEmail}</p>
            <button onClick={() => handleResponse(req.id, 'accept')}>✅ Accept</button>
            <button onClick={() => handleResponse(req.id, 'reject')}>❌ Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRequestsPanel;