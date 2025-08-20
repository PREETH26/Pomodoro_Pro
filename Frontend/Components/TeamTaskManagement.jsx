import { useState } from "react";

export default function TeamTaskManagement({ addTask }) {
  const [task, setTask] = useState("");
  const [pomodoros, setPomodoros] = useState(1);
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [assignTo, setAssignTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task || !assignTo) return;
    addTask({
      task,
      pomodoros,
      priority,
      deadline,
      assignTo,
      assignedBy: "Me", // Replace with logged-in user later
      status: "pending",
    });
    setTask("");
    setPomodoros(1);
    setPriority("Low");
    setDeadline("");
    setAssignTo("");
  };

  return (
    <form
      className="bg-white p-6 rounded-2xl shadow-lg w-[420px]"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-5 text-xl font-semibold text-gray-800">
        Team Task Management
      </h2>

      {/* Task Name */}
      <input
        className="border mb-3 w-full p-2 rounded"
        placeholder="Task Name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
      />

      {/* Pomodoros */}
      <input
        className="border mb-3 w-full p-2 rounded"
        type="number"
        min="1"
        value={pomodoros}
        onChange={(e) => setPomodoros(e.target.value)}
      />

      {/* Priority */}
      <select
        className="border mb-3 w-full p-2 rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      {/* Deadline */}
      <input
        type="date"
        className="border mb-3 w-full p-2 rounded"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {/* Assign To */}
      <input
        className="border mb-3 w-full p-2 rounded"
        placeholder="Assign To (name/email)"
        value={assignTo}
        onChange={(e) => setAssignTo(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        + Assign Task
      </button>
    </form>
  );
}
