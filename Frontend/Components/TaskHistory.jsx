export default function TaskHistory({ tasks, onPendingClick, onLiveClick }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-[950px] mt-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Task History</h2>

      <div className="flex gap-10">
        {/* Live Tasks */}
        <div className="w-1/3">
          <h3 className="font-semibold mb-2">Live Tasks</h3>
          {tasks.filter((t) => t.status === "live").length === 0 ? (
            <p className="text-gray-500">No live tasks</p>
          ) : (
            tasks
              .filter((t) => t.status === "live")
              .map((t, i) => (
                <div
                  key={i}
                  onClick={() => onLiveClick(t)}
                  className="border p-2 mb-2 rounded flex justify-between cursor-pointer hover:bg-blue-50"
                >
                  <span>{t.name}</span>
                  <span className="text-sm text-gray-500">
                    {t.pomodoros} 🍅 | {t.priority}
                  </span>
                </div>
              ))
          )}
        </div>

        {/* Pending / Urgent */}
        <div className="w-1/3">
          <h3 className="font-semibold mb-2">Pending | Urgent</h3>
          {tasks.filter((t) => t.status === "pending" || t.priority === "High").length === 0 ? (
            <p className="text-gray-500">No pending/urgent tasks</p>
          ) : (
            tasks
              .filter((t) => t.status === "pending" || t.priority === "High")
              .map((t, i) => (
                <div
                  key={i}
                  onClick={() => onPendingClick(t)}
                  className="border p-2 mb-2 rounded flex justify-between cursor-pointer hover:bg-blue-50"
                >
                  <span>{t.name}</span>
                  <span className="text-sm text-gray-500">
                    {t.pomodoros} 🍅 | {t.priority}
                  </span>
                </div>
              ))
          )}
        </div>

        {/* ✅ Completed */}
        <div className="w-1/3">
          <h3 className="font-semibold mb-2">Completed</h3>
          {tasks.filter((t) => t.status === "completed").length === 0 ? (
            <p className="text-gray-500">No completed tasks yet</p>
          ) : (
            tasks
              .filter((t) => t.status === "completed")
              .map((t, i) => (
                <div
                  key={i}
                  className="border p-2 mb-2 rounded flex justify-between bg-green-50 text-green-700"
                >
                  <span>{t.name}</span>
                  <span className="text-sm">✅ Done</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
