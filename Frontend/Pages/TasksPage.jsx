import { useState } from "react";
import Timer from "../Components/Timer2";
import TaskManagement from "../Components/TaskManagement";
import TaskHistory from "../Components/TaskHistory";
import "../src/App.css";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Completion popup state
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Add a new task or update an existing one
  const addTask = (task) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.task === editingTask.task ? { ...task, status: t.status } : t
        )
      );
      setEditingTask(null);
    } else {
      setTasks((prev) => [...prev, { ...task, status: "pending" }]);
    }
  };

  // Mark a task as complete (called only if user confirms completion)
  const completeTask = (task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.task === task.task ? { ...t, status: "completed" } : t
      )
    );
    setActiveTask(null);
    setShowCompletionPopup(false);
  };

  // Called by Timer when all pomodoros are done
  const handlePomodoroComplete = (task) => {
    setShowCompletionPopup(true);
    setSelectedTask(task);
  };

  // If user says "not completed", open in TaskManagement for editing
  const handleNotCompleted = () => {
    setEditingTask(selectedTask);
    setShowCompletionPopup(false);
    setActiveTask(null);
  };

  // Start/select a task → make it "live"
  const startTask = (task) => {
    if (tasks.some((t) => t.status === "live")) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.task === task.task ? { ...t, status: "live" } : t
      )
    );
    setActiveTask({ ...task, status: "live" });
    setShowPopup(false);
    setSelectedTask(null);
  };

  // Handler for clicking a pending/urgent task
  const handlePendingTaskClick = (task) => {
    if (tasks.some((t) => t.status === "live")) return;
    setSelectedTask(task);
    setShowPopup(true);
  };

  // Handler for clicking a live task
  const handleLiveTaskClick = () => {};

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-black">
      <h1 className="text-white mb-6 ">Welcome, XYZ</h1>

      <div className="flex gap-8">
        <Timer activeTask={activeTask} onComplete={handlePomodoroComplete} />
        <TaskManagement addTask={addTask} editingTask={editingTask} />
      </div>

      <TaskHistory
        tasks={tasks}
        onPendingClick={handlePendingTaskClick}
        onLiveClick={handleLiveTaskClick}
      />

      {/* Start Pomodoro Popup */}
      {showPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Start Pomodoro for "{selectedTask.task}"?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => startTask(selectedTask)}
              >
                Start Pomodoro
              </button>
              <button
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Popup */}
      {showCompletionPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Did you complete "{selectedTask.task}"?
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
                No, Edit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
