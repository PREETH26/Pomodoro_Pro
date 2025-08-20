import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamTaskHistory() {
  const [assignedToMe, setAssignedToMe] = useState([]);
  const [assignedByMe, setAssignedByMe] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  // ✅ fetch tasks assigned to me
  const fetchAssignedToMe = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/team-tasks/assigned-to-me", {
        withCredentials: true,
      });
      setAssignedToMe(res.data);
    } catch (err) {
      console.error("Error fetching assigned-to-me tasks:", err);
    }
  };

  // ✅ fetch tasks assigned by me
  const fetchAssignedByMe = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/team-tasks/assigned-by-me", {
        withCredentials: true,
      });
      setAssignedByMe(res.data);
    } catch (err) {
      console.error("Error fetching assigned-by-me tasks:", err);
    }
  };

  useEffect(() => {
    fetchAssignedToMe();
    fetchAssignedByMe();
  }, []);

  // ✅ update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/team-tasks/${taskId}/status`,
        { status },
        { withCredentials: true }
      );

      // refresh lists
      fetchAssignedToMe();
      fetchAssignedByMe();

      // update activeTask if needed
      if (status === "live") setActiveTask(res.data);
      else if (status === "done") setActiveTask(null);
    } catch (err) {
      console.error("Error updating task status:", err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-[950px] mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Team Task History</h2>

      <div className="flex gap-10">
        {/* Assigned To Me */}
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Assigned To Me</h3>
          {assignedToMe.length === 0 ? (
            <p className="text-gray-500">No tasks assigned to you</p>
          ) : (
            assignedToMe.map((t) => (
              <div
                key={t._id}
                className={`border p-3 mb-2 rounded flex justify-between items-center ${
                  activeTask?._id === t._id ? "bg-blue-100 border-blue-500" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"} | Priority:{" "}
                    {t.priority}
                  </p>
                  <p className="text-xs text-gray-400">Assigned by: {t.assignedBy?.name}</p>
                </div>
                <div className="flex gap-2">
                  {t.status !== "done" && (
                    <>
                      {activeTask?._id === t._id ? (
                        <button
                          onClick={() => updateTaskStatus(t._id, "pending")}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          End
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(t._id, "live")}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          disabled={!!activeTask && activeTask._id !== t._id}
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => updateTaskStatus(t._id, "done")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Assigned By Me */}
<div className="w-1/2">
  <h3 className="font-semibold mb-2">Assigned By Me</h3>
  {assignedByMe.length === 0 ? (
    <p className="text-gray-500">You haven’t assigned tasks</p>
  ) : (
    assignedByMe.map((t) => (
      <div
        key={t._id}
        className="border p-3 mb-2 rounded"
      >
        <div className="mb-2">
          <p className="font-medium">{t.name}</p>
          <p className="text-sm text-gray-500">
            Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"} | Priority:{" "}
            {t.priority}
          </p>
        </div>

        {/* list of assigned people + status */}
        <div className="pl-3 border-l">
          {t.assignedTo.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center mb-1"
            >
              <span className="text-sm text-gray-700">
                {u.name} ({u.email})
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  u.status === "done"
                    ? "bg-green-200 text-green-700"
                    : u.status === "live"
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ))
  )}
</div>

      </div>
    </div>
  );
}
