// components/organisms/TeamChat.js
import React, { useEffect, useState } from 'react';
import { useAuth } from "../AuthContext";
import "../../css/Chat.css";
import {TEAM_MESSAGES_URL} from "../../assets/urls/djangoUrls";

export default function TeamChat({ teamId }) {
  const { api } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await api.get(TEAM_MESSAGES_URL(teamId));
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post(TEAM_MESSAGES_URL(teamId), { text });
      setText("");
      fetchMessages(); // Atualiza mensagens
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    if (!teamId) return;
    fetchMessages();
    // Opcional: fetch a cada X segundos
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [teamId]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <strong>{msg.sender_username}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
