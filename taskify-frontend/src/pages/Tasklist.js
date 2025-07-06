import React, { useEffect, useState, useCallback } from 'react'; 
import './Tasklist.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);

      // Initialize status map
      const initialMap = {};
      data.forEach(task => {
        initialMap[task._id] = task.status;
      });
      setStatusMap(initialMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const clearSelectedTasks = async () => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected.");
      return;
    }

    const confirmClear = window.confirm(`Delete ${selectedTasks.length} selected task(s)?`);
    if (!confirmClear) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks/soft-delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds: selectedTasks }),
      });

      if (!res.ok) throw new Error('Failed to delete selected tasks');

      setTasks(prev => prev.filter(task => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      setSelectionMode(false); // Exit selection mode after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectChange = (taskId, value) => {
    setStatusMap(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleStatusUpdate = async (taskId) => {
    const newStatus = statusMap[taskId];
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update task status');
      const updated = await res.json();

      setTasks(prev => prev.map(task => (task._id === taskId ? updated : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tasklist-container">
      <h2>Task List</h2>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <>
              <ul className="task-list">
                {tasks.map(task => {
                  const currentStatus = task.status;
                  const selectedStatus = statusMap[task._id] || currentStatus;
                  const isChanged = selectedStatus !== currentStatus;

                  return (
                    <li key={task._id} className="task-item">
                      {selectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task._id)}
                          onChange={() => handleCheckboxChange(task._id)}
                          className="task-checkbox"
                        />
                      )}
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        <p>{task.description || <em>No description</em>}</p>
                        <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                        <p><strong>Status:</strong> {currentStatus}</p>

                        <label htmlFor={`status-${task._id}`}>Change Status:</label>
                        <select
                          id={`status-${task._id}`}
                          value={selectedStatus}
                          onChange={(e) => handleSelectChange(task._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        {isChanged && (
                          <button
                            className="update-status-btn"
                            onClick={() => handleStatusUpdate(task._id)}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {!selectionMode ? (
                <button
                  className="clear-btn"
                  onClick={() => setSelectionMode(true)}
                >
                  Clear Tasks
                </button>
              ) : (
                <div className="button-group">
                  <button
                    className="clear-btn"
                    onClick={clearSelectedTasks}
                    disabled={selectedTasks.length === 0}
                  >
                    Confirm Delete
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedTasks([]);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TaskList;
