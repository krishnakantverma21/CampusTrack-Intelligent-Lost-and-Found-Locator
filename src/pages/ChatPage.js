import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getMessages,
  sendMessage,
  markMessagesAsSeen,
  checkChatPermission
} from '../services/chatService';
import { getUserByEmail } from '../services/userService';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { email: receiverEmail } = useParams();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';

  const [userProfileUrl, setUserProfileUrl] = useState('/assets/default-profile.png');
  const [receiver, setReceiver] = useState({ name: '', profileImageUrl: '' });
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, message: null });

  useEffect(() => {
    if (!receiverEmail || !receiverEmail.includes('@')) navigate('/chat-center');
  }, [receiverEmail, navigate]);

  useEffect(() => {
    if (!userEmail) {
      alert("User not logged in. Please log in again.");
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const [receiverRes, senderRes, msgsRes] = await Promise.all([
          getUserByEmail(receiverEmail),
          getUserByEmail(userEmail),
          getMessages(userEmail, receiverEmail),
        ]);
        setReceiver(receiverRes.data || { name: receiverEmail, profileImageUrl: '/assets/default-profile.png' });
        setUserProfileUrl(senderRes.data?.profileImageUrl || '/assets/default-profile.png');
        setMessages(msgsRes.data || []);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to load chat data', err);
      }
    };

    load();
  }, [receiverEmail, userEmail, navigate]);

  useEffect(() => {
    const unseenIds = messages.filter(m => !m.seen && m.receiverEmail === userEmail).map(m => m.id);
    if (unseenIds.length > 0) markMessagesAsSeen(unseenIds);
  }, [messages, userEmail, receiverEmail]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    };
  }, [mediaRecorder]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const checkPermissionBeforeChat = async () => {
    try {
      const allowed = await checkChatPermission(userEmail, receiverEmail);
      return allowed;
    } catch (err) {
      console.error('Permission check failed', err);
      return false;
    }
  };

  const handleSendText = async () => {
    if (!text.trim()) return;

    const allowed = await checkPermissionBeforeChat();
    if (!allowed) {
      alert('Chat not allowed. Request was rejected or not accepted yet.');
      return;
    }

    const payload = {
      senderEmail: userEmail,
      receiverEmail,
      type: 'text',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setSending(true);
    try {
      await sendMessage(payload);
      const res = await getMessages(userEmail, receiverEmail);
      setMessages(res.data || []);
      setText('');
      scrollToBottom();
    } catch (err) {
      console.error('Send failed', err);
    } finally {
      setSending(false);
    }
  };

  const handleFileChosen = async (file) => {
    const allowed = await checkPermissionBeforeChat();
    if (!allowed) {
      alert('Chat not allowed. Request was rejected or not accepted yet.');
      return;
    }

    const type = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('audio/')
      ? 'audio'
      : 'file';

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('http://localhost:8088/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const { url } = await uploadRes.json();

      const payload = {
        senderEmail: userEmail,
        receiverEmail,
        type,
        content: url,
        filename: file.name,
        timestamp: new Date().toISOString(),
      };

      await sendMessage(payload);
      const res = await getMessages(userEmail, receiverEmail);
      setMessages(res.data || []);
      scrollToBottom();
    } catch (err) {
      console.error('File send failed', err);
    }
  };

  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChosen(file);
    e.target.value = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `voice_${Date.now()}.webm`, { type: blob.type });
        handleFileChosen(file);
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setMediaRecorder(null);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleDeleteForMe = async (msg) => {
    await fetch(`http://localhost:8088/api/chat/delete-for-me/${msg.id}?userEmail=${userEmail}`, { method: 'PUT' });
    const res = await getMessages(userEmail, receiverEmail);
    setMessages(res.data || []);
  };

  const handleDeleteForAll = async (msg) => {
    await fetch(`http://localhost:8088/api/chat/delete/${msg.id}`, { method: 'DELETE' });
    const res = await getMessages(userEmail, receiverEmail);
    setMessages(res.data || []);
  };

  const handleEditMessage = async (msg) => {
    const newText = window.prompt("Edit your message:", msg.content);
    if (newText && newText !== msg.content) {
      await fetch(`http://localhost:8088/api/chat/edit/${msg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: newText,
      });
      const res = await getMessages(userEmail, receiverEmail);
      setMessages(res.data || []);
    }
  };

  const handleRightClick = (e, msg) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, message: msg });
  };

  const handleContextAction = async (action) => {
    const msg = contextMenu.message;
    if (!msg) return;
    if (action === 'edit') await handleEditMessage(msg);
    if (action === 'delete-me') await handleDeleteForMe(msg);
    if (action === 'delete-all') await handleDeleteForAll(msg);
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const visibleMessages = messages.filter(m => !(m.deletedFor || []).includes(userEmail));

  return (
    <div className="chat-page" onClick={() => setContextMenu({ ...contextMenu, visible: false })}>
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat-center')}>←</button>
        <img className="header-avatar" src={receiver.profileImageUrl || '/assets/default-profile.png'} alt={receiver.name} />
        <div className="header-info">
          <div className="header-name">{receiver.name || receiverEmail}</div>
          <div className="header-status">Last seen recently</div>
        </div>
      </div>

            <div className="chat-body">
        {visibleMessages.map((m, idx) => {
          const isMine = m.senderEmail === userEmail;
          const senderName = isMine ? 'You' : receiver.name || m.senderEmail;
          const senderAvatar = isMine ? userProfileUrl : receiver.profileImageUrl || '/assets/default-profile.png';

          return (
            <div key={idx} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && <img className="msg-avatar" src={senderAvatar} alt={senderName} />}
              <div className={`message-bubble ${m.type}`} onContextMenu={(e) => handleRightClick(e, m)}>
                <div className="msg-sender">{senderName}</div>
                {m.type === 'text' && <div className="msg-text">{m.content}</div>}
                {m.type === 'image' && <img className="msg-media" src={m.content} alt={m.filename || 'image'} />}
                {m.type === 'video' && <video className="msg-media" controls src={m.content} />}
                {m.type === 'audio' && <audio className="msg-audio" controls src={m.content} />}
                {m.type === 'file' && (
                  <a className="msg-file" href={m.content} target="_blank" rel="noopener noreferrer">
                    {m.filename || 'file'}
                  </a>
                )}
                <div className="msg-meta">
                  <span className="msg-time">{new Date(m.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              {isMine && <img className="msg-avatar" src={senderAvatar} alt={senderName} />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {contextMenu.visible && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          {contextMenu.message.senderEmail === userEmail ? (
            <>
              <div onClick={() => handleContextAction('edit')}>✏️ Edit</div>
              <div onClick={() => handleContextAction('delete-me')}>🗑️ Delete for me</div>
              <div onClick={() => handleContextAction('delete-all')}>🗑️ Delete for all</div>
            </>
          ) : (
            <div onClick={() => handleContextAction('delete-me')}>🗑️ Delete for me</div>
          )}
        </div>
      )}

      <div className="chat-input">
        <div className="left-actions">
          <button className="circle-btn" title="Send photo" onClick={() => { fileInputRef.current.accept = 'image/*'; handlePickFile(); }}>📷</button>
          <button className="circle-btn" title="Send video" onClick={() => { fileInputRef.current.accept = 'video/*'; handlePickFile(); }}>🎥</button>
          <button
            className={`circle-btn ${recording ? 'recording' : ''}`}
            title={recording ? 'Stop recording' : 'Record audio'}
            onClick={() => (recording ? stopRecording() : startRecording())}
          >🎤</button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>

        <textarea
          className="text-input"
          placeholder="Type your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />

        <button className="send-btn" onClick={handleSendText} disabled={sending}>➤</button>
      </div>
    </div>
  );
};

export default ChatPage;