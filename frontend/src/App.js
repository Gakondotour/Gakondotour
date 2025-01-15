// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import ConfirmationBooking from './ConfirmationBooking';
import Dashboard from './Dashboard';
import Login from "./Login";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/confirmation_booking' element={<ConfirmationBooking />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
