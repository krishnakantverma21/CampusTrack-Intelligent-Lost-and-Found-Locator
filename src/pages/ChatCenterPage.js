import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getConversations,
  getUnseenMessages,
  checkChatPermission
} from '../services/chatService';
import { getUserByEmail } from '../services/userService';
import ChatRequestsPanel from './ChatRequestsPanel'; // ✅ Import the panel
import '../styles/ChatCenter.css';

const ChatCenterPage = () => {
  const userEmail = localStorage.getItem('userEmail');
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [unseenCounts, setUnseenCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getConversations(userEmail);
        const msgs = res.data || [];
        setMessages(msgs);

        const otherEmails = [...new Set(
          msgs.map(m => m.senderEmail === userEmail ? m.receiverEmail : m.senderEmail)
        )];

        const details = {};
        await Promise.all(
          otherEmails.map(async (email) => {
            try {
              const userRes = await getUserByEmail(email);
              details[email] = userRes.data || {
                name: email,
                profileImageUrl: '/assets/default-profile.png',
              };
            } catch {
              details[email] = {
                name: email,
                profileImageUrl: '/assets/default-profile.png',
              };
            }
          })
        );

        setUserDetails(details);
      } catch (err) {
        console.error('Error loading conversations:', err);
      }
    };

    const fetchUnseen = async () => {
      try {
        const res = await getUnseenMessages(userEmail);
        const unseen = res.data || [];
        const counts = {};
        unseen.forEach(msg => {
          const sender = msg.senderEmail;
          counts[sender] = (counts[sender] || 0) + 1;
        });
        setUnseenCounts(counts);
      } catch (err) {
        console.error("Failed to fetch unseen messages", err);
      }
    };

    if (userEmail) {
      fetchConversations();
      fetchUnseen();
    }
  }, [userEmail]);

  const grouped = messages.reduce((acc, msg) => {
    const otherEmail = msg.senderEmail === userEmail ? msg.receiverEmail : msg.senderEmail;
    if (!acc[otherEmail]) acc[otherEmail] = [];
    acc[otherEmail].push(msg);
    return acc;
  }, {});

  const handleChatClick = async (otherEmail) => {
    if (otherEmail === userEmail) {
      alert("You can't chat with yourself.");
      return;
    }

    try {
      const allowed = await checkChatPermission(userEmail, otherEmail);
      if (allowed) {
        navigate(`/chat/${otherEmail}`);
      } else {
        alert("Chat not allowed. This user hasn't accepted your request yet.");
      }
    } catch (err) {
      console.error("Permission check failed", err);
      alert("Something went wrong while checking chat permission.");
    }
  };

  return (
    <div className="chat-center">
      <h2>💬 Your Conversations</h2>

      {/* ✅ Chat Request Panel */}
      <ChatRequestsPanel />

      {Object.keys(grouped).length === 0 ? (
        <p>No messages yet</p>
      ) : (
        Object.entries(grouped).map(([otherEmail, msgs]) => {
          const latest = msgs[msgs.length - 1];
          const otherUser = userDetails[otherEmail] || {
            name: otherEmail,
            profileImageUrl: '/assets/default-profile.png',
          };
          const unreadCount = unseenCounts[otherEmail] || 0;

          return (
            <div
              key={otherEmail}
              className="chat-preview"
              onClick={() => handleChatClick(otherEmail)}
            >
              <img
                src={otherUser.profileImageUrl}
                alt={otherUser.name}
                className="chat-avatar"
              />
              <div className="chat-info">
                <p className="chat-name">
                  <strong>{otherUser.name}</strong>
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </p>
                <p className="chat-snippet">
                  {latest.type === 'text'
                    ? latest.content
                    : `[${latest.type}] ${latest.filename || ''}`}
                </p>
                <span className="chat-timestamp">
                  {new Date(latest.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatCenterPage;