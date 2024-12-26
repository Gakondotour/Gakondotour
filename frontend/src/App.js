import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Main from './Main'
import Nav from './Nav';
import Admin from './Admin';


function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    //fetch db from background
    axios.get('http://127.0.0.1:5000/')
    .then(res => setData(res.data))
    .catch(error => `Error ${error}`)
  }, [])

  return (
    <div className="App">
      {/* <Nav /> */}
      {/* <Main /> */}
      <Admin />
    </div>
  );
}

export default App;
