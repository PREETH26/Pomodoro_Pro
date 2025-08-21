export default function TeamTaskHistory({ tasks, activeTask, startTask, completeTask, endTask }) {
  const assignedToMe = tasks.filter((t) => t.assignedTo?.some(u => u._id));
  const assignedByMe = tasks.filter((t) => t.assignedBy);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-[950px] mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Team Task History</h2>

      {/* Live Task Section */}
      {activeTask && (
        <div className="mb-6 p-4 border rounded bg-blue-50 border-blue-400 flex justify-between items-center">
          <div>
            <p className="font-medium text-blue-700">Live Task: {activeTask.name}</p>
            <p className="text-sm text-gray-500">
              Deadline: {activeTask.deadline ? new Date(activeTask.deadline).toLocaleDateString() : "N/A"} | Priority: {activeTask.priority}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => endTask(activeTask)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              End
            </button>
            <button
              onClick={() => completeTask(activeTask)}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Complete
            </button>
          </div>
        </div>
      )}

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
                    Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"} | Priority: {t.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  {t.status !== "done" && (
                    <>
                      {activeTask?._id === t._id ? (
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
                          disabled={!!activeTask && activeTask._id !== t._id}
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
          {assignedByMe.length === 0 ? (
            <p className="text-gray-500">You haven’t assigned tasks</p>
          ) : (
            assignedByMe.map((t) => (
              <div key={t._id} className="border p-3 mb-2 rounded">
                <div className="mb-2">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"} | Priority: {t.priority}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
