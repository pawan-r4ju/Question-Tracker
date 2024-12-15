import React, { useState, useEffect } from 'react';

const TaskItem = ({ task, toggleDone }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="task-details">
        <h3 className="text-2xl font-semibold text-white mb-2 hover:text-blue-400">{task.Task}</h3>
        <p className="text-gray-300"><strong>Difficulty:</strong> {task.Difficulty}</p>
        <p className="text-gray-300"><strong>Topics:</strong> {task.Topics.join(', ')}</p>
        <p className="text-gray-300"><strong>Description:</strong> {task.Description}</p>
        <p className="text-gray-300"><strong>Example:</strong> {task.Example.Input} → {task.Example.Output}</p>
      </div>
      <div className="task-actions mt-4 flex justify-center">
        <button 
          onClick={() => toggleDone(task.ID)} 
          className={`px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ease-in-out focus:outline-none ${task.Done ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} hover:scale-105`}
        >
          {task.Done ? 'Undo' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, toggleDone }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.ID} task={task} toggleDone={toggleDone} />
      ))}
    </div>
  );
};

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-600 rounded-full mt-4">
      <div
        className="h-2 rounded-full bg-green-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Check if tasks are in localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Fetching the JSON data from the public directory
      fetch('/tasks.json')
        .then((response) => response.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error('Error loading JSON data:', error));
    }
  }, []);
  
  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const toggleDone = (taskID) => {
    setTasks(tasks.map((task) =>
      task.ID === taskID ? { ...task, Done: !task.Done } : task
    ));
  };

  // Calculate the percentage of tasks marked as done
  const doneTasksCount = tasks.filter(task => task.Done).length;
  const percentageDone = tasks.length > 0 ? (doneTasksCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black rounded-xl shadow-xl mt-12">
      {/* Fixed Container for Header and Progress Bar */}
      <div className="sticky top-0 bg-black p-6 rounded-xl shadow-xl z-10">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-white">QUESTION TRACKER</h1>
        
        {/* Progress Bar and Percentage */}
        <div className="flex items-center justify-between">
          <ProgressBar percentage={percentageDone} />
          <span className="text-white font-semibold">{Math.round(percentageDone)}%</span>
        </div>
      </div>

      {/* Task List */}
      <TaskList tasks={tasks} toggleDone={toggleDone} />
    </div>
  );
};

export default App;
