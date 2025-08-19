import { useState } from 'react'
import "./App.css"
import Signup from '../Pages/Signup'
import Login from "../Pages/Login"
import {BrowserRouter, Routes, Route} from "react-router"

function App() {
  return(
  <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
