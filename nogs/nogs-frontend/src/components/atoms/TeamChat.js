import { useEffect, useState, useRef } from 'react';
import { useAuth } from "../AuthContext";
import { TEAM_MESSAGES_URL } from "../../assets/urls/djangoUrls";


export default function TeamChat({ teamId }) {
    const { api, user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

        setIsTyping(true);
        try {
            await api.post(TEAM_MESSAGES_URL(teamId), { text });
            setText("");
            await fetchMessages(); // Wait for messages to update
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setIsTyping(false);
        }
        scrollToBottom();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    useEffect(() => {
        if (!teamId) return;
        fetchMessages();

        // Polling for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [teamId]);

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-message ${user.id === msg.sender ? "you" : "them"}`}>
                        <strong>{msg.sender_username}: </strong>
                        <span>{msg.text}</span>
                        <span className="message-timestamp">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {isTyping && (
                    <div className="typing-indicator them">
                        <span>Typing</span>
                        <div className="typing-dots">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSend} disabled={!text.trim() || isTyping}>
                    {isTyping ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
