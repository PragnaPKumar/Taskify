import React, { useState } from 'react';
import './Register.css';
import logos from '../assets/images/Taskifylogo.png'; 
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res =  await fetch('http://localhost:5000/api/auth/register',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("✅ Server response:", data); // 👈 LOG THIS

    if (!res.ok) {
      alert(data.error || data.message || data.errors?.map(err => err.msg).join('\n') || "Unknown error");
      return;
    }

    // Safe check before using data.user
    if (!data.user || !data.token) {
      alert("Registration succeeded, but response format is incorrect.");
      return;
    }

    alert('User Registered successfully!');
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', data.user.name);
    navigate('/dashboard');

  } catch (error) {
    console.error('Error:', error);
    alert('Server error occurred');
  }
};


  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
  <img src={logos} alt="Taskify Logo" className="logo" />
  <h2 className="form-title">Register</h2>

  <div className="input-group">
    <label htmlFor="name">Full Name</label>
    <input
      id="name"
      type="text"
      name="name"
      placeholder="Enter your full name"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="email">Email Address</label>
    <input
      id="email"
      type="email"
      name="email"
      placeholder="Enter your email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>

  <div className="input-group">
    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      required
    />
  </div>

  <button type="submit">Register</button>
  <p className="form-footer">
    Already have an account? <a href="/Login">Login here</a>
  </p>
</form>

    </div>
  );
}


export default Register;
