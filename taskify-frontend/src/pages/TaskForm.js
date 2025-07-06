import React, { useState, useEffect, useRef } from 'react';
import './Taskform.css';

function TaskForm() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validate = () => {
    const errors = {};
    if (!task.title.trim()) errors.title = 'Title is required';
    if (!task.description.trim()) errors.description = 'Description is required';

    if (task.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(task.dueDate);
      if (due < today) errors.dueDate = 'Due date cannot be in the past';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const userId = localStorage.getItem('userId');
    console.log('Submitting task with userId:', userId);
    if (!userId) {
      alert('User not logged in');
      setLoading(false);
      return;
    }
setLoading(true);
try {
  const res = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, userId }), // <-- include userId here
  });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Task creation failed');
      } else {
        setSuccessMsg('Task added successfully!');
        setTask({ title: '', description: '', dueDate: '', status: 'Pending' });
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="taskform-container">
      <h2>Add New Task</h2>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
          ref={titleRef}
          aria-describedby="titleError"
          required
        />
        {errors.title && <small id="titleError" className="error">{errors.title}</small>}

        <label htmlFor="description">Task Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          aria-describedby="descriptionError"
          required
        />
        {errors.description && (
          <small id="descriptionError" className="error">{errors.description}</small>
        )}

        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          aria-describedby="dueDateError"
        />
        {errors.dueDate && <small id="dueDateError" className="error">{errors.dueDate}</small>}

        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={task.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>

        {successMsg && <div className="success-message">{successMsg}</div>}
      </form>
    </div>
  );
}

export default TaskForm;
