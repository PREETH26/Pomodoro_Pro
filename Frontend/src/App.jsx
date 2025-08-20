import { useState } from 'react'
import "./App.css"
import Signup from '../Pages/Signup'
import Login from "../Pages/Login"
import {BrowserRouter, Routes, Route} from "react-router"
import Dashboard from '../Pages/dashboard'

function App() {
  return(
  <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
