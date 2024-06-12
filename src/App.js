import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
