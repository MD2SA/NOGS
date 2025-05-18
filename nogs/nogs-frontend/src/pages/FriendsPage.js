import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import {
    GET_FRIENDS_URL,
    SEND_FRIEND_REQUEST_URL,
    RESPOND_FRIEND_REQUEST_URL,
    ALL_USERS_URL,
    REMOVE_FRIEND_URL,
    CANCEL_REQUEST_URL,
} from "../assets/urls/djangoUrls";

function FriendsPage() {
    const navigate = useNavigate();
    const { api } = useAuth();

    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [received, setReceived] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [addFriendQuery, setAddFriendQuery] = useState('');
    const [friendToRemove, setFriendToRemove] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [friendsRes, usersRes] = await Promise.all([
                    api.get(GET_FRIENDS_URL),
                    api.get(ALL_USERS_URL)
                ]);
                setFriends(friendsRes.data.friends);
                setPending(friendsRes.data.sent_requests || []);
                setReceived(friendsRes.data.received_requests || []);
                setAllUsers(usersRes.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();
    }, []);

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredNewUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(addFriendQuery.toLowerCase()) &&
        !friends.some(f => f.id === user.id) &&
        !pending.some(p => p.id === user.id) &&
        !received.some(r => r.id === user.id)
    ).slice(0, 3);

    const handleRemove = (id) => {
        const friend = friends.find(f => f.id === id);
        setFriendToRemove(friend);
        setShowConfirm(true);
    };

    const confirmRemove = async () => {
        if (!friendToRemove) return;
        try {
            await api.get(REMOVE_FRIEND_URL(friendToRemove.id));
            setFriends(prev => prev.filter(f => f.id !== friendToRemove.id));
        } catch (err) { }
        setShowConfirm(false);
        setFriendToRemove(null);
    };

    const cancelRemove = () => {
        setShowConfirm(false);
        setFriendToRemove(null);
    };

    const handleMessage = friend =>
        navigate(`/messages/${friend.id}`, {
            state: { friendName: friend.username }
        });

    const handleCancelRequest = async (requestId) => {
        try {
            await api.post(CANCEL_REQUEST_URL, { request_id: requestId });
            setPending(p => p.filter(x => x.id !== requestId));
        } catch (err) {
            console.error("Failed to cancel request", err);
        }
    };


    const handleAcceptRequest = async (requestId) => {
        try {
            await api.post(RESPOND_FRIEND_REQUEST_URL, { request_id: requestId, action: 'accept' });
            const acc = received.find(x => x.request_id === requestId);
            if (acc) {
                setFriends(f => [...f, { id: acc.id, username: acc.username }]);
                setReceived(r => r.filter(x => x.request_id !== requestId));
            }
        } catch (err) { }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await api.post(RESPOND_FRIEND_REQUEST_URL, {
                request_id: requestId,
                action: 'reject'
            });
            setReceived(r => r.filter(x => x.request_id !== requestId));
        } catch (err) {
            console.error('Failed to reject request', err);
        }
    };

    const handleSendRequest = async (user) => {
        try {
            await api.post(SEND_FRIEND_REQUEST_URL, { to_user_id: user.id });
            setPending([...pending, user]);
            setAddFriendQuery('');
        } catch (err) {
            console.error('Failed to send request', err);
        }
    };

    return (
        <div className="friends-page">
            <div className="split-container">
                <div className="left-column">
                    <h2 className="friends-title">Friends</h2>
                    <input
                        type="text"
                        className="friends-search"
                        placeholder="Search for a friend..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />

                    <section className="friends-section">
                        <h2 className="friends-subtitle">Your Friends</h2>
                        <ul className="friend-list">
                            {filteredFriends.map(f => (
                                <li key={f.id} className="friend-item">
                                    <span>{f.username}</span>
                                    <div className="friend-actions">
                                        <button onClick={() => handleMessage(f)}>Message</button>
                                        <button onClick={() => handleRemove(f.id)} className="remove-btn">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="friends-section">
                        <h2 className="friends-subtitle">Pending Sent</h2>
                        <ul className="friend-list">
                            {pending.map(f => (
                                <li key={f.id} className="friend-item pending">
                                    <span>{f.username} (Pending)</span>
                                    <div className="friend-actions">
                                        <button onClick={() => handleCancelRequest(f.id)} className="remove-btn">Cancel</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="friends-section">
                        <h2 className="friends-subtitle">Pending Received</h2>
                        <ul className="friend-list">
                            {received.map(f => (
                                <li key={f.id} className="friend-item pending">
                                    <span>{f.username} (Incoming)</span>
                                    <div className="friend-actions">
                                        <button onClick={() => handleAcceptRequest(f.request_id)}>✓</button>
                                        <button onClick={() => handleRejectRequest(f.request_id)}>✗</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="right-column">
                    <h2 className="friends-title">Add New Friends</h2>
                    <input
                        type="text"
                        className="friends-search"
                        placeholder="Search users..."
                        value={addFriendQuery}
                        onChange={e => setAddFriendQuery(e.target.value)}
                    />
                    <ul className="friend-list">
                        {filteredNewUsers.map(user => (
                            <li key={user.id} className="friend-item">
                                <span>{user.username}</span>
                                <div className="friend-actions">
                                    <button onClick={() => handleSendRequest(user)}>Send Request</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {showConfirm && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <p>Remove <strong>{friendToRemove?.username}</strong> from your friends?</p>
                        <div className="popup-buttons">
                            <button className="confirm-btn" onClick={confirmRemove}>Yes</button>
                            <button className="cancel-btn" onClick={cancelRemove}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FriendsPage;
