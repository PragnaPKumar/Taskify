import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

 
   const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  // Optionally redirect to login page
  navigate('/login');
};
    


  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Taskify</h2>
        <div className="dashboard-username"></div>
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/dashboard/Taskform">Task Form</Link></li>
          <li><Link to="/dashboard/Tasklist">Task List</Link></li>
          
        </ul>
      </nav>

     
        <main className="dashboard-content">
         

        <div className="logout-icon" onClick={handleLogout} title="Logout">
          🔒 Logout{/* Or use Font Awesome icon if integrated */}
        </div>
        <Outlet />
      </main>
      
    </div>
  );
}

export default Dashboard;
