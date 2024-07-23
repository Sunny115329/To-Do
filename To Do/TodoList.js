import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editTask, setEditTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');

    useEffect(() => {
        axios.get(API_URL).then(response => setTasks(response.data));
    }, []);

    const addTask = () => {
        axios.post(API_URL, { text: newTask, completed: false })
            .then(response => setTasks([...tasks, response.data]))
            .catch(error => console.error(error));
        setNewTask('');
    };

    const deleteTask = id => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => setTasks(tasks.filter(task => task.id !== id)))
            .catch(error => console.error(error));
    };

    const completeTask = id => {
        const task = tasks.find(task => task.id === id);
        axios.put(`${API_URL}/${id}`, { ...task, completed: !task.completed })
            .then(response => setTasks(tasks.map(t => (t.id === id ? response.data : t))))
            .catch(error => console.error(error));
    };

    const updateTask = id => {
        axios.put(`${API_URL}/${id}`, { text: editTaskText, completed: false })
            .then(response => setTasks(tasks.map(t => (t.id === id ? response.data : t))))
            .catch(error => console.error(error));
        setEditTask(null);
        setEditTaskText('');
    };

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        {editTask === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTaskText}
                                    onChange={e => setEditTaskText(e.target.value)}
                                />
                                <button onClick={() => updateTask(task.id)}>Update</button>
                            </>
                        ) : (
                            <>
                                <span onClick={() => completeTask(task.id)}>{task.text}</span>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                                <button onClick={() => {
                                    setEditTask(task.id);
                                    setEditTaskText(task.text);
                                }}>Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
