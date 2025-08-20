import { useState } from 'react'
import "./Signup.css"
import axios from "axios"
import { Link } from 'react-router-dom'

function Signup() {
  const [formData,setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password);


  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError("");
    setSuccess("")
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
    setError("All fields are required!");
    return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Enter a valid email");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("",formData)
      setSuccess("Signup Successfull!")

    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  }

  

  return (
    <div className='bg-main'>
      <form className='card' onSubmit={handleSubmit}>
          <h1 className='heading'>SIGNUP</h1>

          <div className='input-body'>
            <input placeholder='Name' className='input-field' type='text' value={formData.name} name="name" onChange={handleChange} required/>
            <input placeholder='Email' className='input-field' type='email' value={formData.email} name="email" onChange={handleChange} required/>
            <input placeholder='Password' className='input-field' type='password' value={formData.password} name="password" onChange={handleChange} required/>
            <input placeholder='Confirm Password' className='input-field' type='password' value={formData.confirmPassword} name="confirmPassword" onChange={handleChange} required/>
            
          </div>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

          <button className='submit'>SIGNUP</button>
          <div>
            <p className='account-change'>Already have an account?</p>
            <Link to="/Login" className='change-btn'>Log In</Link>
          </div>
      </form>
    </div>
  )
}
export default Signup;