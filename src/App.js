import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  Navigate,
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messanger/Messenger';

function App() {

  const {user} = useContext(AuthContext)

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <Home/> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register/>} />
        <Route path="/messenger" element={!user ? <Navigate to="/" replace /> : <Messenger/>} />
        <Route path="/profile/:username" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;
