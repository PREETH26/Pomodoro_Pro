import { useState } from 'react'
import "./App.css"
import Signup from '../Pages/Signup'
import Login from "../Pages/Login"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Hero from '../Pages/Hero'
import Protected from "../Auth/Protected"
// import Dashboard from './Pages/Dashboard'
import TasksPage from "../Pages/TasksPage";
import TeamTasksPage from '../Pages/TeamTasksPage'



function App() {
  return(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/personal' element={<TasksPage/>}/>
      <Route path='/teams' element={<TeamTasksPage/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
