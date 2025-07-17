import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND_URL;
function Admin() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch users from backend
    axios.get(API_URL+'/admin')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL+'/admin', { username, password })
      .then(response => {
        setUsers([...users, { username, password }]);
        setUsername('');
        setPassword('');
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default Admin;
