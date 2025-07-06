import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function DashboardOverview() {
  const username = localStorage.getItem('username') || 'User';
  const userId = localStorage.getItem('userId');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/tasks/${userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error loading tasks:', err));
  }, [userId]);

  function isToday(dateStr) {
  const taskDate = new Date(dateStr);
  const today = new Date();

  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
}
  
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const recentTasks = [...tasks].slice(-3).reverse();
  const todayTasks = tasks.filter(task => isToday(task.dueDate));

  
  return (
    <div className="overview-container">
      <div className="overview-header">
        <h2>Welcome, {username}!</h2>

      {todayTasks.length > 0 && (
        <div className="notification">
          🔔 You have {todayTasks.length} task{todayTasks.length > 1 ? 's' : ''} assigned for today!
        </div>
      )}
    </div>
      <div className="stats-cards">
        <div className="card">📋 Total Tasks: {total}</div>
        <div className="card">🕒 Pending: {pending}</div>
        <div className="card">🚧 In Progress: {inProgress}</div>
        <div className="card">✅ Completed: {completed}</div>
      </div>

      <div className="quick-links">
        <button onClick={() => navigate('/dashboard/Taskform')}>➕ Add Task</button>
        <button onClick={() => navigate('/dashboard/Tasklist')}>📄 View Tasks</button>
      </div>

      <div className="recent-tasks">
        <h3>Recent Tasks</h3>
        {recentTasks.length === 0 ? (
          <p>No recent tasks found.</p>
        ) : (
          <ul>
            {recentTasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> - {new Date(task.dueDate).toLocaleDateString()} - <em>{task.status}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
