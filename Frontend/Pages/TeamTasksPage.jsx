import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Timer from "../Components/Timer2";
import TeamTaskManagement from "../Components/TeamTaskManagement";
import TeamTaskHistory from "../Components/TeamTaskHistory";
import { Link } from "react-router";
import { ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL+"/api";

export default function TeamTasksPage() {
  const [assignedToMe, setAssignedToMe] = useState([]);
  const [assignedByMe, setAssignedByMe] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [toMe, byMe] = await Promise.all([
        axios.get(`${API}/team-tasks/assigned-to-me`, { withCredentials: true }),
        axios.get(`${API}/team-tasks/assigned-by-me`, { withCredentials: true }),
      ]);
      setAssignedToMe(toMe.data || []);
      setAssignedByMe(byMe.data || []);
    } catch (err) {
      console.error("Error fetching team tasks:", err.response?.data || err.message);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Start a task (Assigned To Me)
  const startTask = async (task) => {
    try {
      // only one live at a time (client guard)
      const anyLive =
        assignedToMe.some(t => t.status === "live") ||
        (activeTask && activeTask._id !== task._id);
      if (anyLive) return;

      await axios.patch(`${API}/team-tasks/${task._id}/status`, { status: "live" }, { withCredentials: true });
      // set as active for the timer
      setActiveTask({ ...task, status: "live" });
      await fetchAll();
    } catch (err) {
      console.error("Failed to start task:", err.response?.data || err.message);
    }
  };

  // End current task (back to pending)
  const endTask = async (task) => {
    try {
      await axios.patch(`${API}/team-tasks/${task._id}/status`, { status: "pending" }, { withCredentials: true });
      setActiveTask(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to end task:", err.response?.data || err.message);
    }
  };

  // Complete task (manual button)
  const completeTask = async (task) => {
    try {
      await axios.patch(`${API}/team-tasks/${task._id}/status`, { status: "completed" }, { withCredentials: true });
      setActiveTask(null);
      setShowCompletionPopup(false);
      await fetchAll();
    } catch (err) {
      console.error("Failed to complete task:", err.response?.data || err.message);
    }
  };

  // Called by Timer when pomodoros are done
  const handlePomodoroComplete = (task) => {
    setSelectedTask(task);
    setShowCompletionPopup(true);
  };

  const handleNotCompleted = async () => {
    try {
      if (!selectedTask) return;
      await axios.patch(`${API}/team-tasks/${selectedTask._id}/status`, { status: "pending" }, { withCredentials: true });
      setActiveTask(null);
      setShowCompletionPopup(false);
      setSelectedTask(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to set pending:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-5 text-black flex flex-col items-center">
      <h1 className="text-white self-start font-bold text-xl flex ">
        <ArrowRight />
        <Link to="/personal" className="ml-2 hover:text-blue-300">Personal Task Manager</Link>
      </h1>

      <h1 className="text-white mb-6 text-xl text-center">
        <span className="font-semibold text-2xl">Team Task</span> <br />
        Dashboard
      </h1>

      <div className="flex gap-8">
        <Timer activeTask={activeTask} onComplete={handlePomodoroComplete} />
        <TeamTaskManagement onTaskCreated={fetchAll} />
      </div>

      <TeamTaskHistory
        assignedToMe={assignedToMe}
        assignedByMe={assignedByMe}
        activeTask={activeTask}
        startTask={startTask}
        completeTask={completeTask}
        endTask={endTask}
      />

      {/* Completion Popup (after timer wraps all pomodoros) */}
      {showCompletionPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Did you complete “{selectedTask.name}”?
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
