import { Link } from "react-router-dom";
import React from "react";
export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 to-blue-600 text-white">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-1 ml-10 mt-10">POMODORO PRO</h1>
        <div className="flex items-center mt-8 text-2xl bg-white px-4 py-0 rounded-[10px] mr-10">
            <Link to="/login" className="px-3 text-black hover:font-bold">Login</Link>
            <span className="mx-2 text-black">|</span>
            <Link to="/signup" className="px-3 text-black hover:font-bold">Signup</Link>
        </div>
      </div>
      <Link to="/signup">
        <button className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700">
          GET STARTED
        </button>
      </Link>
    
    </div>
  );
}