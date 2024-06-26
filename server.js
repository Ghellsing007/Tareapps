const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/task');

const app = express();

mongoose.connect('mongodb://localhost:27017/tareas' , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.json(newTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { text }, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});
