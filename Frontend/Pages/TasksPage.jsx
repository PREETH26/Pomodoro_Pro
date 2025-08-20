import { useState, useEffect } from "react";
import Timer from "../Components/Timer2";
import TaskManagement from "../Components/TaskManagement";
import TaskHistory from "../Components/TaskHistory";
import { fetchTasks, createTask, updateTask } from "../api/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from backend
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  };

  // Add / Update task
  const addTaskHandler = async (task) => {
    console.log(task)
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, task);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        // ✅ Update activeTask if currently running
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

  // Complete task  
  const completeTaskHandler = async (task) => {
    try {
      const res = await updateTask(task._id, { completed: true });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
      if (activeTask?._id === task._id) setActiveTask(null);
      setShowCompletionPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Called by Timer when pomodoros done
  const handlePomodoroComplete = (task) => {
    setShowCompletionPopup(true);
    setSelectedTask(task);
    loadTasks(); // refresh tasks after minutesSpent increment
  };

  const handleNotCompleted = () => {
    setEditingTask(selectedTask);
    setShowCompletionPopup(false);
    setActiveTask(null);
  };

  const startTask = async (task) => {
  console.log("Sending task to backend:", task._id, { status: "live" });

  try {
    const res = await updateTask(task._id, { status: "live" });
    console.log("Backend response:", res.data);

    setTasks(prev =>
      prev.map(t => (t._id === task._id ? res.data : t))
    );
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

  return (
    <div className="min-h-screen flex flex-col items-center p-6 text-black">
      <h1 className="text-white mb-6">Welcome, XYZ</h1>

      <div className="flex gap-7">
        <Timer activeTask={activeTask} onComplete={handlePomodoroComplete} />
        <TaskManagement addTask={addTaskHandler} editingTask={editingTask} />
      </div>

      <TaskHistory
        tasks={tasks}
        onPendingClick={handlePendingTaskClick}
        onLiveClick={handleLiveTaskClick}
      />

      {/* Start / Edit Popup */}
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
