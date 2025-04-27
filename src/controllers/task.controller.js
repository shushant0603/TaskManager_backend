import {Task} from '../models/task.model.js';

export const getTasks = async (req, res) => {
    try {
        // Only fetch tasks for the current user
        const tasks = await Task.find({ userId: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
}

export const createTask = async (req, res) => {
    const { title, description } = req.body;

    try {
        // Create task with the current user's ID
        const newTask = new Task({
            title,
            description,
            userId: req.user._id // Ensure userId is set
        });
        
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        // Only update if the task belongs to the current user
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { title, description },
            { new: true }
        );
        
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        // Only delete if the task belongs to the current user
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
        
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
}
// export const getTaskById = async (req, res) => {
