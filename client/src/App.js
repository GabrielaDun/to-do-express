import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState();

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket']});
    setSocket(socket);
    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });
  
    socket.on('updateData', (tasksList) => {
      updateTasks(tasksList);
      });
  }, []);
  
  const updateTasks = tasks => {
    setTasks(tasks)
  }

  const removeTask = ( id, inStorage) => {
    setTasks(tasks => tasks.filter(task => task.id !== id))
    inStorage && socket.emit('removeTask', id)
  }


  const submitForm = event => {
    event.preventDefault();

    if (taskName !== '') {
      const taskId = uuidv4();
      const newTask = { id: taskId, name: taskName};
      socket && socket.emit('addTask', newTask)
      addTask(newTask)
      setTaskName('');
    }
  }

  const addTask = (newTask) => {
    setTasks(tasks => [...tasks, newTask])
   }

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (
            <li className='task' key={task.id}>
              {task.name}
              <button className='btn btn--red' onClick = {() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <form id="add-task-form" onSubmit={e=> submitForm(e)}>
          <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={taskName} 
            onChange={(event) => setTaskName(event.target.value)}
          />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}
export default App;