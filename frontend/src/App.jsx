import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/Signup'
import Home from './pages/Home'
import Login from './pages/Login'
import Video from './pages/Video'
import ChannelPage from './pages/ChannelPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp />} ></Route>
        <Route path='/' element= {<Home/>} ></Route>
        <Route path='/Login' element= {<Login/>} ></Route>
        <Route path='/watchpage/:videoId' element = {<Video/>} ></Route>
        <Route path='/channel/:username' element= {<ChannelPage />}> </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
