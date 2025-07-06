const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create a task with userId
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, dueDate, status } = req.body;

     if (!userId || userId === 'undefined') {
    return res.status(400).json({ error: 'Valid userId is required' });
    }

    const task = new Task({ userId, title, description, dueDate, status });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/deleted/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.params.userId,
      isDeleted: true,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching deleted tasks' });
  }
});

// Get all tasks for a specific userId
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId,isDeleted: false });
     
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// Clear all tasks for a user
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.params.userId });
    res.status(200).json({ message: 'All tasks cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear tasks' });
  }
});
// Delete multiple selected tasks by IDs
router.post('/soft-delete-multiple', async (req, res) => {
  const { taskIds } = req.body;
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ error: 'No task IDs provided' });
  }

  try {
    await Task.updateMany(
      { _id: { $in: taskIds } },
      { $set: { isDeleted: true } }
    );
    res.json({ message: 'Selected tasks soft deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete tasks' });
  }
});
// Update task status
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});





module.exports = router;
