import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './assets/images/logo-prathin.jpg'; 
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import TaskForm from './pages/TaskForm';
import TaskList from './pages/Tasklist';
import DashboardOverview from './pages/DashboardOverview';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="TaskForm" element={<TaskForm />} />
            <Route path="Tasklist" element={<TaskList />} />
          </Route>

          {/* 404 or redirect route here if needed */}
        </Routes>
      </Router>
      <footer className="footer">
        <img src={logo} alt="Taskify Logo" className="footer-logo" />
        <small>© 2025 Taskify. All rights reserved.</small>
      </footer>
    </>
  );
}

export default App;
