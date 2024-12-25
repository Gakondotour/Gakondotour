import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Main from './Main'
import Nav from './Nav';

function App() {
  return (
    <div className="App">
      <Nav />
      <Main />
    </div>
  );
}

export default App;
