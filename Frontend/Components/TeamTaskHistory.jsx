export default function TeamTaskHistory({ tasks, activeTask, startTask, completeTask, endTask }) {
  const myName = "Me"; // Replace with real user logic if needed

  console.log("activeTask", activeTask);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-[900px] mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Team Task History</h2>

      <div className="flex gap-10">
        {/* Assigned To Me */}
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Assigned To Me</h3>
          {tasks.filter((t) => t.assignTo === myName).length === 0 ? (
            <p className="text-gray-500">No tasks assigned to you</p>
          ) : (
            tasks
              .filter((t) => t.assignTo === myName)
              .map((t, i) => (
                <div
                  key={i}
                  className={`border p-3 mb-2 rounded flex justify-between items-center ${
                    activeTask?.task === t.task ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{t.task}</p>
                    <p className="text-sm text-gray-500">
                      Deadline: {t.deadline || "N/A"} | Priority: {t.priority}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {t.status !== "done" && (
                      <>
                        {activeTask?.task === t.task ? (
                          <button
                            onClick={() => endTask(t)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            End
                          </button>
                        ) : (
                          <button
                            onClick={() => startTask(t)}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            disabled={!!activeTask && activeTask.task !== t.task}
                          >
                            Start
                          </button>
                        )}
                        <button
                          onClick={() => completeTask(t)}
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
          {tasks.filter((t) => t.assignedBy === myName).length === 0 ? (
            <p className="text-gray-500">You haven’t assigned tasks</p>
          ) : (
            tasks
              .filter((t) => t.assignedBy === myName)
              .map((t, i) => (
                <div
                  key={i}
                  className={`border p-3 mb-2 rounded flex justify-between items-center ${
                    activeTask?.task === t.task ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{t.task}</p>
                    <p className="text-sm text-gray-500">
                      Assigned to: {t.assignTo} | Deadline: {t.deadline || "N/A"} | Priority: {t.priority}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      t.status === "done"
                        ? "bg-green-200 text-green-700"
                        : t.status === "live"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
