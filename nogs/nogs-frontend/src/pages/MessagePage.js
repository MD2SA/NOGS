import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../css/MessagePage.css';
import { useAuth } from '../components/AuthContext';
import { MESSAGES_URL } from "../assets/urls/djangoUrls";


function MessagePage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedName = location.state?.friendName;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { api, user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(MESSAGES_URL(friendId));
        const localId = user?.id || JSON.parse(localStorage.getItem('user'))?.id;
        setMessages(res.data.map(m => ({
          text: m.text,
          sender: m.sender === localId ? 'you' : 'them'
        })));
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    fetchMessages();
  }, [friendId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    try {
      await api.post(MESSAGES_URL(friendId), { text: input });
      setMessages([...messages, { text: input, sender: 'you' }]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="message-page">
      <button className="back-button" onClick={() => navigate('/friends')}>
        ← Back to Friends
      </button>

      <h1 className="chat-header">
        Chat with {passedName || 'Unknown User'}
      </h1>

      <div className="message-area">
        {messages.length === 0 ? (
          <p style={{ color: '#888' }}>Start your conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'you' ? 'you' : 'them'}`}
            >
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default MessagePage;
