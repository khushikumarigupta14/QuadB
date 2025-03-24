import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaPlus, FaTrash, FaSort } from "react-icons/fa";

const glassmorphism = `
  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

document.head.insertAdjacentHTML(
  "beforeend",
  `<style>${glassmorphism}</style>`
);

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, priority: Math.random() }]);
      setTask("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const sortTasks = () => {
    setTasks([...tasks].sort((a, b) => b.priority - a.priority));
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-5 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-lg mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Task Input */}
      <div className="w-full max-w-lg flex items-center glassmorphism p-4 rounded-lg mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-grow p-2 bg-transparent text-inherit outline-none"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTask}
          className="ml-2 p-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600"
        >
          <FaPlus />
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-lg">
        {tasks.length > 0 && (
          <button
            onClick={sortTasks}
            className="mb-3 p-2 flex items-center gap-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <FaSort /> Sort by Priority
          </button>
        )}

        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex justify-between items-center glassmorphism p-3 rounded-lg mb-2"
          >
            <span>{task.text}</span>
            <button
              onClick={() => removeTask(index)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;

/* Tailwind Glassmorphism Styles */
// const glassmorphism = `
//   .glassmorphism {
//     background: rgba(255, 255, 255, 0.1);
//     backdrop-filter: blur(10px);
//     border-radius: 10px;
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   }
// `;

// document.head.insertAdjacentHTML(
//   "beforeend",
//   `<style>${glassmorphism}</style>`
// );
