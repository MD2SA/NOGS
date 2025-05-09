import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/MessagePage.css';

function MessagePage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockFriends = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  const friend = mockFriends.find(f => f.id === parseInt(friendId));

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'you' }]);
    setInput('');
  };

  return (
    <div className="message-page">
      {/* 👇 Back Button */}
      <button
        className="back-button"
        onClick={() => navigate('/friends')}
      >
        ← Back to Friends
      </button>

      <h1 className="chat-header">
        Chat with {friend ? friend.name : 'Unknown User'}
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
        {/* 👇 Auto-scroll anchor */}
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
