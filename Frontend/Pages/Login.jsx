import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData);
      setSuccess("Login Successful!");
      console.log("login");
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-main">
      <form className="card" onSubmit={handleSubmit}>
        <h1 className="heading-lg">LOGIN</h1>

        <div className="input-body">
          <input
            placeholder="Email"
            className="input-field"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            className="input-field"
            type="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}

        <button className="submit">LOGIN</button>
        <div>
          <p className="account-change-lg">Don’t have an account?</p>
          <Link to="/signup" className="change-btn">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
