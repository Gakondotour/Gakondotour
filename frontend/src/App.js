// frontend/src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Flask + React App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
