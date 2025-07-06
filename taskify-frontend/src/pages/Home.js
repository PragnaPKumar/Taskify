import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content">
        <h1 className="title">📝 Taskify</h1>
        <p className="subtitle">
          Organize your tasks, set priorities, and never miss a deadline.
        </p>
        <button className="btn-primary" onClick={() => navigate('/register')}>
          Register
        </button>
        <button className="btn-primary" onClick={() => navigate('/Login')}>
          Login
        </button>
      </div>

      
    </div>
  );
}

export default Home;
