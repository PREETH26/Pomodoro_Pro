import { useState, useEffect } from "react";

export default function Timer2({ activeTask, onComplete }) {
  const WORK_TIME = 25 * 60;   // 25 min
  const SHORT_BREAK = 5 * 60;  // 5 min
  const LONG_BREAK = 15 * 60;  // 15 min

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

  const handleSessionComplete = () => {
    if (mode === "Focus") {
      const nextPomodoro = pomodoroCount + 1;

      if (activeTask && nextPomodoro >= activeTask.pomodoros) {
        setIsRunning(false);
        setPomodoroCount(nextPomodoro);
        onComplete({ ...activeTask, status: "completed" }); 
        return;
      }

      setPomodoroCount(nextPomodoro);
      setIsRunning(false);
      setShowBreakPopup(true);
    } else {
      setMode("Focus");
      setTime(WORK_TIME);
      setIsRunning(true);
    }
  };

  const startBreak = () => {
    setShowBreakPopup(false);
    if (pomodoroCount % 4 === 0) {
      setMode("Long Break");
      setTime(LONG_BREAK);
    } else {
      setMode("Short Break");
      setTime(SHORT_BREAK);
    }
    setIsRunning(true);
  };

  const skipBreak = () => {
    setShowBreakPopup(false);
    setMode("Focus");
    setTime(WORK_TIME);
    setIsRunning(true);
  };

  const markCompleted = () => {
    if (!activeTask) return;
    setIsRunning(false);
    setTime(WORK_TIME);
    setPomodoroCount(0);
    setMode("Focus");
    onComplete?.({ ...activeTask, status: "completed" });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-[500px] flex items-center justify-between">
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

          {activeTask?.status === "live" && (
            <button
              className="border px-4 py-1 rounded w-28"
              onClick={markCompleted}
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold border-[10px] border-blue-400">
          {formatTime(time)}
        </div>
      </div>

      {showBreakPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="mb-4 text-lg font-semibold">
              Take a {pomodoroCount % 4 === 0 ? "Long" : "Short"} Break?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={startBreak}
              >
                Start Break
              </button>
              <button
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                onClick={skipBreak}
              >
                Skip Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
