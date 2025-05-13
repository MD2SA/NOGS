import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Friends.css';
import { useAuth } from '../components/AuthContext';
import {
  GET_FRIENDS_URL,
  SEND_FRIEND_REQUEST_URL,
  RESPOND_FRIEND_REQUEST_URL,
  ALL_USERS_URL,
  REMOVE_FRIEND_URL,
  MESSAGES_URL
} from "../assets/urls/djangoUrls";

function FriendsPage() {
  const navigate = useNavigate();
  const { api } = useAuth();

  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [received, setReceived] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
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
        console.log('all users:', usersRes.data);
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
  );

  const displayUsers = filteredNewUsers.slice(0, 3);

  const handleRemove = (id) => {
    const friend = friends.find(f => f.id === id);
    setFriendToRemove(friend);
    setShowConfirm(true);
  };

const confirmRemove = async () => {
  if (!friendToRemove) return;
  console.log("✅ YES clicked! Calling /Friends/friends/remove/ for:", friendToRemove.id);

  try {
    const res = await api.get(REMOVE_FRIEND_URL(friendToRemove.id));
    console.log("✅ Server response:", res.data);
    setFriends(prev => prev.filter(f => f.id !== friendToRemove.id));
  } catch (err) {
    console.error('❌ Failed to remove friend', err);
  }

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

  const handleCancelRequest = (id) => {
    setPending(p => p.filter(x => x.id !== id));
  };

  const handleAcceptRequest = async (requestId) => {
  try {
    await api.post(RESPOND_FRIEND_REQUEST_URL, { request_id: requestId, action: 'accept' });

    const acc = received.find(x => x.request_id === requestId);
    if (acc) {
      setFriends(f => [...f, { id: acc.id, username: acc.username }]); // send to friends list
      setReceived(r => r.filter(x => x.request_id !== requestId)); // remove from received
    }
  } catch (err) {
    console.error('Failed to accept request', err);
  }
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
      setShowAddFriend(false);
    } catch (err) {
      console.error('Failed to send request', err);
    }
  };

  return (
    <div className="friends-page">
      <div className="friends-container">
        <h1 className="friends-title">Friends</h1>

        <button className="add-friend-button" onClick={() => setShowAddFriend(v => !v)}>
          {showAddFriend ? 'Close Search' : 'Add Friend'}
        </button>

        <input
          type="text"
          className="friends-search"
          placeholder="Search for a friend..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {showAddFriend && (
          <div className="add-friend-section">
            <input
              type="text"
              className="friends-search"
              placeholder="Add a friend!"
              value={addFriendQuery}
              onChange={e => setAddFriendQuery(e.target.value)}
            />
            <ul className="friend-list">
              {displayUsers.map(user => (
                <li key={user.id} className="friend-item">
                  <span>{user.username}</span>
                  <div className="friend-actions">
                    <button onClick={() => handleSendRequest(user)}>Send Request</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
          <h2 className="friends-subtitle">Pending Requests</h2>
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
          <h2 className="friends-subtitle">Pending Requests Received</h2>
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
