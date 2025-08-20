import { useNavigate, Link } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  text-white relative">
      <div className="flex justify-between items-center w-full px-10 py-6 fixed top-0 left-0 bg-gradient-to-r from-blue-700 to-blue-800 shadow-md z-10">
        <h1 className="text-3xl font-extrabold tracking-wide">POMODORO PRO</h1>
        <div className="flex items-center text-xl bg-white px-4 py-1 rounded-lg shadow">
          <Link to="/login" className="px-3 text-black hover:font-bold transition">
            Login
          </Link>
          <span className="mx-2 text-black">|</span>
          <Link to="/signup" className="px-3 text-black hover:font-bold transition">
            Signup
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pt-48 px-6">
        <button
          onClick={() => navigate("/signup")}
          className="w-52 h-52 rounded-full border-4 border-blue-300 flex items-center justify-center text-xl font-extrabold bg-blue-500 hover:bg-blue-600 transition shadow-xl hover:scale-105 hover:shadow-2xl"
        >
          GET STARTED
        </button>

        <p className="mt-8 bg-white text-black px-8 py-3 rounded-xl shadow-lg text-center max-w-xl text-lg">
          Kickstart your focus journey — click Get Started and boost your productivity today!
        </p>

        <div className="mt-20 max-w-3xl text-center px-4 mb-10">
          <h2 className="text-3xl font-bold mb-6 underline decoration-blue-300 decoration-2 underline-offset-4">
            Benefits of Pomodoro Pro
          </h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            <span className="font-semibold text-blue-200">Team Collaboration:</span> Our platform isn’t just about
            individual productivity — it’s built for teams.  
            Assign tasks, track Pomodoro sessions in real-time, and see how your teammates are progressing.  
            Whether you’re working on a group project, preparing for exams together, or managing workplace tasks,  
            Pomodoro Pro keeps everyone aligned, accountable, and motivated while making collaboration effortless.
          </p>
        </div>
      </div>
    </div>
  );
}
