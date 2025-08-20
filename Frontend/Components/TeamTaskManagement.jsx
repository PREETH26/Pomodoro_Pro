import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamTaskManagement({ addTask }) {
  const [task, setTask] = useState("");
  const [pomodoros, setPomodoros] = useState(1);
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [assignTo, setAssignTo] = useState([]); // array of user IDs
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch logged in user
  useEffect(() => {
    const fetchMe = async () => {
     try {
    const res = await axios.get('http://localhost:3000/api/auth/profile', {
      withCredentials: true // <-- important
    });
        setLoggedInUser(res.data);
      } catch (err) {
        console.error("Error fetching logged-in user:", err);
      }
    };
    fetchMe();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!task || assignTo.length === 0 || !loggedInUser) return;

  try {
    const res = await axios.post(
      "http://localhost:3000/api/team-tasks",
      {
        name: task,  // match schema
        pomodoros: Number(pomodoros),
        priority,
        deadline,
        assignedTo: assignTo, // match schema
        assignedBy: loggedInUser._id,
        status: "pending",
      },
      { withCredentials: true }
    );
    console.log("Task created:", res.data);
    addTask(res.data);

    // Reset form
    setTask("");
    setPomodoros(1);
    setPriority("Low");
    setDeadline("");
    setAssignTo([]);
  } catch (err) {
    console.error("Error creating task:", err.response?.data || err.message);
  }
};


  const toggleUser = (id) => {
    if (assignTo.includes(id)) {
      setAssignTo(assignTo.filter((uid) => uid !== id));
    } else {
      setAssignTo([...assignTo, id]);
    }
  };

  return (
    <form
      className="bg-white p-6 rounded-2xl shadow-lg w-[420px] relative"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-5 text-xl font-semibold text-gray-800">
        Team Task Management
      </h2>

      {/* Task Name */}
      <input
        className="border mb-3 w-full p-2 rounded"
        placeholder="Task Name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        required
      />

      {/* Pomodoros */}
      <input
        className="border mb-3 w-full p-2 rounded"
        type="number"
        min="1"
        value={pomodoros}
        onChange={(e) => setPomodoros(e.target.value)}
      />

      {/* Priority */}
      <select
        className="border mb-3 w-full p-2 rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      {/* Deadline */}
      <input
        type="date"
        className="border mb-3 w-full p-2 rounded"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {/* Assign To - Dropdown with checkboxes */}
      <div className="mb-3">
        <div
          className="border rounded p-2 cursor-pointer bg-gray-50"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {assignTo.length > 0
            ? `${assignTo.length} user(s) selected`
            : "Select Users"}
        </div>

        {dropdownOpen && (
          <div className="border rounded mt-2 max-h-40 overflow-y-auto bg-white shadow-lg absolute z-10 w-[360px]">
            {users.map((user) => (
              <label
                key={user._id}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={assignTo.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                />
                <span>
                  {user.name}{" "}
                  <span className="text-sm text-gray-500">({user.email})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        + Assign Task
      </button>
    </form>
  );
}
