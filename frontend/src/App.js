// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
