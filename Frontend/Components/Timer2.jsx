import { useState, useEffect } from "react";
import { updateTask } from "../api/tasks.js";

export default function Timer2({ activeTask, onComplete }) {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [time, setTime] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Focus");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showBreakPopup, setShowBreakPopup] = useState(false);

  useEffect(() => {
    if (activeTask) {
      setTime(WORK_TIME);
      setMode("Focus");
      setPomodoroCount(0);
      setIsRunning(false);
      setShowBreakPopup(false);
    }
  }, [activeTask]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (isRunning && time === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleSessionComplete = async () => {
    if (!activeTask) return;

    if (mode === "Focus") {
      const nextPomodoro = pomodoroCount + 1;
      setPomodoroCount(nextPomodoro);
      setIsRunning(false);
      setShowBreakPopup(true);

      // update backend minutesSpent
      try {
        await updateTask(activeTask._id, {
          minutesSpent: (activeTask.minutesSpent || 0) + WORK_TIME / 60,
        });
      } catch (err) {
        console.error(err);
      }

      // complete task if pomodoros done
      if (nextPomodoro >= activeTask.pomodoros) {
        onComplete?.({ ...activeTask, status: "completed" });
      }
    } else {
      setMode("Focus");
      setTime(WORK_TIME);
      setIsRunning(true);
    }
  };

  const selectMode = (selectedMode) => {
  setShowBreakPopup(false);
  setMode(selectedMode);

  if (selectedMode === "Focus") {
    // Reset timer only when Focus is clicked
    setTime(WORK_TIME);
    setPomodoroCount(0);
    setIsRunning(true);
  } else if (selectedMode === "Short Break") {
    setTime(SHORT_BREAK);
    setIsRunning(true);
  } else if (selectedMode === "Long Break") {
    setTime(LONG_BREAK);
    setIsRunning(true);
  }
};


const markCompleted = async () => {
  if (!activeTask) return;

  try {
    // Update backend: mark as completed and update status
    const res = await updateTask(activeTask._id, {
      completed: true,
      status: "completed",
    });

    // Update frontend via onComplete
    onComplete?.(res.data); 

    // Show the popup so user can choose next step
    setShowBreakPopup(true);

    // ✅ Do NOT reset timer here. Reset only when "Focus" is clicked
  } catch (err) {
    console.error(err);
  }
};



  const resetTimer = () => {
    setIsRunning(false);
    setTime(WORK_TIME);
    setMode("Focus");
    setPomodoroCount(0);
    setShowBreakPopup(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const timerColor = () => {
    if (mode === "Focus") return "bg-blue-600 border-blue-400";
    if (mode === "Short Break") return "bg-green-600 border-green-400";
    if (mode === "Long Break") return "bg-purple-600 border-purple-400";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-[520px] flex items-center justify-between">
      <div className="flex flex-col items-start gap-3">
        <h2 className="mb-2 font-medium text-black">
          Timer {activeTask ? `- ${activeTask.task}` : ""}
        </h2>
        <p className="text-sm text-gray-600 capitalize">Mode: {mode}</p>

        {activeTask && (
          <h2 className="text-lg font-semibold mb-2">
            Working on: {activeTask.task}
          </h2>
        )}

        <p className="text-sm text-gray-600">
          Pomodoros: {pomodoroCount} / {activeTask ? activeTask.pomodoros : 0}
        </p>

        <div className="flex gap-2">
          <button
            className="border px-4 py-1 rounded w-24"
            onClick={() => setIsRunning(!isRunning)}
            disabled={!activeTask}
          >
            {isRunning ? "Pause" : time < WORK_TIME ? "Resume" : "Start"}
          </button>

          <button
            className="border px-4 py-1 rounded w-24"
            onClick={resetTimer}
            disabled={!activeTask}
          >
            Reset
          </button>

          {activeTask?.status === "live" && (
            <button
              className="border px-4 py-1 rounded w-28"
              onClick={markCompleted}
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div
          className={`w-40 h-40 rounded-full text-white flex items-center justify-center text-4xl font-bold border-[10px] ${timerColor()}`}
        >
          {formatTime(time)}
        </div>
      </div>

      {showBreakPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              What do you want to do next?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => selectMode("Focus")}
              >
                Focus
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={() => selectMode("Short Break")}
              >
                Short Break
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                onClick={() => selectMode("Long Break")}
              >
                Long Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
