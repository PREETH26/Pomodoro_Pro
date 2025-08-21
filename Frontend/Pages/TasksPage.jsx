import { useState, useEffect } from "react";
import Timer from "../Components/Timer2";
import TaskManagement from "../Components/TaskManagement";
import TaskHistory from "../Components/TaskHistory";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [userName, setUserName] = useState(""); 

  useEffect(() => {
    loadTasks();
    loadProfile();
  }, []);

  const loadTasks = async () => {
  try {
    const res = await fetchTasks();
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    setTasks(data);
  } catch (err) {
    console.error(err);
    setTasks([]); // fallback so UI doesn’t break
  }
};


  const loadProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        credentials: "include", 
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUserName(data.name); 
    } catch (err) {
      console.error(err);
    }
  };

  const addTaskHandler = async (task) => {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, task);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        if (activeTask?._id === editingTask._id) setActiveTask(res.data);
        setEditingTask(null);
      } else {
        const res = await createTask(task);
        setTasks((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const completeTaskHandler = async (task) => {
    try {
      const res = await updateTask(task._id, { completed: true, status: "completed" });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
      if (activeTask?._id === task._id) setActiveTask(null);
      setShowCompletionPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePomodoroComplete = (task) => {
    setShowCompletionPopup(true);
    setSelectedTask(task);
    loadTasks();
  };

  const handleNotCompleted = () => {
    setEditingTask(selectedTask);
    setShowCompletionPopup(false);
    setActiveTask(null);
  };

  const startTask = async (task) => {
    try {
      const res = await updateTask(task._id, { status: "live" });
      setTasks(prev => prev.map(t => (t._id === task._id ? res.data : t)));
      setActiveTask(res.data);
      setShowPopup(false);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePendingTaskClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const handleLiveTaskClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.name}"?`)) return;
    try {
      await deleteTask(task._id);
      setTasks(prev => prev.filter(t => t._id !== task._id));
      if (activeTask?._id === task._id) setActiveTask(null);
      if (editingTask?._id === task._id) setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-black">
      <h1 className="text-white self-start font-bold text-2xl">
        Welcome, <span className="text-4xl">{userName || "User"}</span>
      </h1>

      <div className="flex gap-7">
        <Timer activeTask={activeTask} onComplete={handlePomodoroComplete} />
        <TaskManagement addTask={addTaskHandler} editingTask={editingTask} />
      </div>

      <TaskHistory
        tasks={tasks || []}
        onPendingClick={handlePendingTaskClick}
        onLiveClick={handleLiveTaskClick}
        onDelete={handleDelete}
      />

      {showPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            {selectedTask.status === "live" ? (
              <>
                <h2 className="mb-4 text-lg font-semibold">
                  Edit "{selectedTask.name}"?
                </h2>
                <div className="flex gap-4">
                  <button
                    className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
                    onClick={() => {
                      setEditingTask(selectedTask);
                      setShowPopup(false);
                    }}
                  >
                    Edit Task
                  </button>
                  <button
                    className="bg-gray-400 px-6 py-2 rounded hover:bg-gray-500"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : tasks.some((t) => t.status === "live") ? (
              <>
                <h2 className="mb-4 text-lg font-semibold">
                  A task is already live. Edit "{selectedTask.name}" instead?
                </h2>
                <div className="flex gap-4">
                  <button
                    className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
                    onClick={() => {
                      setEditingTask(selectedTask);
                      setShowPopup(false);
                    }}
                  >
                    Edit Task
                  </button>
                  <button
                    className="bg-gray-400 px-6 py-2 rounded hover:bg-gray-500"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-lg font-semibold">
                  Start Pomodoro for "{selectedTask.name}"?
                </h2>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    onClick={() => startTask(selectedTask)}
                  >
                    Start Pomodoro
                  </button>
                  <button
                    className="bg-gray-400 px-6 py-2 rounded hover:bg-gray-500"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showCompletionPopup && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Did you complete "{selectedTask.name}"?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={() => completeTaskHandler(selectedTask)}
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
