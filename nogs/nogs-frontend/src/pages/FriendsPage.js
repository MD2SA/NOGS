import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Friends.css';

function FriendsPage() {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [received, setReceived] = useState([
    { id: 6, name: 'Fiona' },
    { id: 7, name: 'George' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriendQuery, setAddFriendQuery] = useState('');

  const [allUsers] = useState([
    { id: 10, name: 'Daniel' },
    { id: 11, name: 'Eva' },
    { id: 12, name: 'Frank' },
    { id: 13, name: 'Alice' },
    { id: 14, name: 'George' }
  ]);

  useEffect(() => {
    setFriends([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]);
    setPending([
      { id: 4, name: 'Diana' },
      { id: 5, name: 'Eli' }
    ]);
  }, []);

  // filter your friends
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // filter candidates for new friends
  const filteredNewUsers = allUsers.filter(user =>
  user.name.toLowerCase().includes(addFriendQuery.toLowerCase()) &&
  !friends.some(f => f.id === user.id) &&
  !pending.some(p => p.id === user.id) &&
  !received.some(r => r.id === user.id)
);


  // display at most 3: top matches or fallback to any 3
  const displayUsers = filteredNewUsers.length > 0
  ? filteredNewUsers.slice(0, 3)
  : allUsers
      .filter(user =>
        !friends.some(f => f.id === user.id) &&
        !pending.some(p => p.id === user.id) &&
        !received.some(r => r.id === user.id)
      )
      .slice(0, 3);

  // handlers
  const handleRemove = id => setFriends(friends.filter(f => f.id !== id));
  const handleMessage = friend => navigate(`/messages/${friend.id}`);
  const handleCancelRequest = id => setPending(pending.filter(p => p.id !== id));
  const handleAcceptRequest = id => {
    const accepted = received.find(r => r.id === id);
    if (accepted) {
      setFriends([...friends, accepted]);
      setReceived(received.filter(r => r.id !== id));
    }
  };
  const handleRejectRequest = id => setReceived(received.filter(r => r.id !== id));
  const handleSendRequest = user => {
    alert(`Sent friend request to ${user.name}`);
    setAddFriendQuery('');
    setShowAddFriend(false);
  };

  return (
    <div className="friends-page">
      <div className="friends-container">
        <h1 className="friends-title">Friends</h1>

        {/* Add Friend Toggle */}
        <button
          className="add-friend-button"
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          {showAddFriend ? 'Close Search' : 'Add Friend'}
        </button>

        {/* Main Friends Search */}
        <input
          type="text"
          className="friends-search"
          placeholder="Search for a friend..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {/* Add Friend Section */}
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
                  <span>{user.name}</span>
                  <div className="friend-actions">
                    <button onClick={() => handleSendRequest(user)}>
                      Send Request
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Your Friends */}
        <section className="friends-section">
          <h2 className="friends-subtitle">Your Friends</h2>
          <ul className="friend-list">
            {filteredFriends.map(friend => (
              <li key={friend.id} className="friend-item">
                <span>{friend.name}</span>
                <div className="friend-actions">
                  <button onClick={() => handleMessage(friend)}>
                    Message
                  </button>
                  <button
                    onClick={() => handleRemove(friend.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Pending Sent Requests */}
        <section className="friends-section">
          <h2 className="friends-subtitle">Pending Requests</h2>
          <ul className="friend-list">
            {pending.map(friend => (
              <li key={friend.id} className="friend-item pending">
                <span>{friend.name} (Pending)</span>
                <div className="friend-actions">
                  <button
                    onClick={() => handleCancelRequest(friend.id)}
                    className="remove-btn"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Pending Received Requests */}
        <section className="friends-section">
          <h2 className="friends-subtitle">Pending Requests Received</h2>
          <ul className="friend-list">
            {received.map(friend => (
              <li key={friend.id} className="friend-item pending">
                <span>{friend.name} (Incoming)</span>
                <div className="friend-actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptRequest(friend.id)}
                  >
                    ✓
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRejectRequest(friend.id)}
                  >
                    ✗
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default FriendsPage;
