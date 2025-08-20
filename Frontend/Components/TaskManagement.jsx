import { useState, useEffect } from "react";

export default function TaskManagement({ addTask, editingTask }) {
  const [task, setTask] = useState("");
  const [pomodoros, setPomodoros] = useState(1);
  const [priority, setPriority] = useState("Low");

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.task);
      setPomodoros(editingTask.pomodoros);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) return;
    addTask({
      task,
      pomodoros,
      priority,
      status: editingTask ? editingTask.status : "pending",
    });
    setTask("");
    setPomodoros(1);
    setPriority("Low");
  };

  return (
    <form
      className="bg-white p-6 rounded-2xl shadow-lg w-[420px]"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-5 text-xl font-semibold text-gray-800">
        Task Management
      </h2>

      {/* Task Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Task Name
        </label>
        <input
          className="border border-gray-300 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
      </div>

      {/* Pomodoros */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Pomodoros
        </label>
        <input
          className="border border-gray-300 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          type="number"
          min="1"
          value={pomodoros}
          onChange={(e) => setPomodoros(e.target.value)}
        />
      </div>

      {/* Priority */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Priority
        </label>
        <select
          className="border border-gray-300 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
      >
        + Create Task
      </button>
    </form>
  );
}
