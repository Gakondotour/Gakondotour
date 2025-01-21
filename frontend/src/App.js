// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Home';
import ConfirmationBooking from './ConfirmationBooking';
import Dashboard from './Dashboard';
import Login from "./Login";
import ActivityImages from './ActivityImages';
import Book from './Book';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/confirmation_booking' element={<ConfirmationBooking />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route />
          <Route path='/ActivatyImages' element={<ActivityImages />} />
          <Route path='/Book' element={<Book />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
