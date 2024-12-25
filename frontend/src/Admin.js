// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch users from backend
    axios.get('http://127.0.0.1:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/user', { username, email })
      .then(response => {
        setUsers([...users, { username, email }]);
        setUsername('');
        setEmail('');
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
