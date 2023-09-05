const express = require('express')
const app = express();
const socket = require('socket.io');

const server = app.listen (8000, () => {
    console.log('Server is running on port: 8000')
})
const io = socket(server);

let tasks = [];

io.on('connection', (socket) => {
    socket.emit('updateData', tasks)

    socket.on('addTask', ( task ) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task)
    })
    socket.on('removeTask', ( taskId ) => {
        const taskIndex = tasks.findIndex(task => {
            return task.id === socket.id
        })

        if (taskIndex !== -1) {
            const removedTask = tasks.splice(taskDelete, 1)
            socket.broadcast.emit('removeTask', removedTask)
        }
    })
})

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});