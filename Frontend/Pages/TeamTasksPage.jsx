import { useState, useEffect } from "react";
import Timer from "../Components/Timer2";
import TeamTaskManagement from "../Components/TeamTaskManagement";
import TeamTaskHistory from "../Components/TeamTaskHistory";
import axios from "axios";

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch all tasks assigned to me & by me
  const fetchTasks = async () => {
    try {
      const resAssignedToMe = await axios.get(
        "http://localhost:3000/api/team-tasks/assigned-to-me",
        { withCredentials: true }
      );
      const resAssignedByMe = await axios.get(
        "http://localhost:3000/api/team-tasks/assigned-by-me",
        { withCredentials: true }
      );
      setTasks([...resAssignedToMe.data, ...resAssignedByMe.data]);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task (from TeamTaskManagement)
  const addTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  // Start a task → triggers Timer
  const startTask = (task) => {
    if (tasks.some((t) => t.status === "live")) return; // only one live task
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: "live" } : t))
    );
    setActiveTask({ ...task, status: "live" });
  };

  // End the current live task (set to pending)
  const endTask = (task) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: "pending" } : t))
    );
    setActiveTask(null);
    updateTaskStatusBackend(task._id, "pending");
  };

  // Complete task
  const completeTask = (task) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: "done" } : t))
    );
    setActiveTask(null);
    setShowCompletionPopup(false);
    updateTaskStatusBackend(task._id, "done");
  };

  // Not completed popup
  const handleNotCompleted = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === selectedTask._id ? { ...t, status: "pending" } : t
      )
    );
    setActiveTask(null);
    setShowCompletionPopup(false);
    updateTaskStatusBackend(selectedTask._id, "pending");
  };

  // Called by Timer after pomodoros complete
  const handlePomodoroComplete = (task) => {
    setShowCompletionPopup(true);
    setSelectedTask(task);
  };

  // Update task status in backend
  const updateTaskStatusBackend = async (taskId, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/team-tasks/${taskId}/status`,
        { status },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating task status:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 text-black flex flex-col items-center">
      <h1 className="text-white mb-6 text-xl text-center">
        <span className="font-semibold text-2xl">Team Task</span> <br />
        Dashboard
      </h1>

      <div className="flex gap-8">
        <Timer activeTask={activeTask} onComplete={handlePomodoroComplete} />
        <TeamTaskManagement addTask={addTask} />
      </div>

      <TeamTaskHistory
        tasks={tasks}
        activeTask={activeTask}
        startTask={startTask}
        completeTask={completeTask}
        endTask={endTask}
      />

      {/* Completion Popup */}
      {showCompletionPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Did you complete "{selectedTask.name}"?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={() => completeTask(selectedTask)}
              >
                Yes, Completed
              </button>
              <button
                className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
                onClick={handleNotCompleted}
              >
                No, Keep Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
