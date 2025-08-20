import { useState } from "react";
import Timer from "../Components/Timer";
import TeamTaskManagement from "../Components/TeamTaskManagement";
import TeamTaskHistory from "../Components/TeamTaskHistory";

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Add task
  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, status: "pending" }]);
  };

  // Start a task (auto start timer)
  const startTask = (task) => {
    if (tasks.some((t) => t.status === "live")) return; // only one live task

    setTasks((prev) =>
      prev.map((t) =>
        t.task === task.task ? { ...t, status: "live" } : t
      )
    );
    setActiveTask({ ...task, status: "live" }); // pass to Timer → starts automatically
  };

  // Called by Timer after pomodoros complete
  const handlePomodoroComplete = (task) => {
    setShowCompletionPopup(true);
    setSelectedTask(task);
  };

  // Confirm completion
  const completeTask = (task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.task === task.task ? { ...t, status: "done" } : t
      )
    );
    setActiveTask(null);
    setShowCompletionPopup(false);
  };

  // If user says "not completed"
  const handleNotCompleted = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.task === selectedTask.task ? { ...t, status: "pending" } : t
      )
    );
    setActiveTask(null);
    setShowCompletionPopup(false);
  };

  // End the current live task (set to pending)
  const endTask = (task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.task === task.task ? { ...t, status: "pending" } : t
      )
    );
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen p-6 text-black flex flex-col items-center">
      <h1 className="text-white mb-6 text-xl text-center"><span className="font-semibold text-2xl">Team Task</span> <br/>Dashboard</h1>

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
                No, Keep Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
