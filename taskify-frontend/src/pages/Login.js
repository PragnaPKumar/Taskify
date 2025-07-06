import React, { useState } from 'react';
import './Login.css';
import logos from '../assets/images/Taskifylogo.png'; 
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });

    const data = await res.json();
    console.log('Login response:', data);


    if (!res.ok) {
  alert(data.error || data.errors?.map(err => err.msg).join('\n'));
} else {
  console.log('Login response:', data);

const username = data.user?.name || formData.email.split('@')[0]; 
localStorage.setItem('username', username);
localStorage.setItem('userId', data.user.id);  // ✅ This is what TaskForm & TaskList need
localStorage.setItem('token', data.token);

  alert('Login successful!');
  navigate('/dashboard');

  } }catch (error) {
    console.error('Login error:', error);
    alert('Server error');
  }
};

  return (
    <div className="login-container">
      
      <form  className="login-form" onSubmit={handleSubmit}>
         <img src={logos} alt="Taskify Logo" className="logo" />
<div className="input-group">
<h2>Login</h2>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        </div>
<div className="input-group">
        <label htmlFor="password" style={{ marginTop: '1rem' }}>Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
</div>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
