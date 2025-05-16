import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage.jsx';
import './App.css'
import Vasu from './components/Vasu.jsx';
import AgentHomePage from './components/Agent/AgentHomePage.jsx';
import 'react-tooltip/dist/react-tooltip.css'

const App = () => {
  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/agent' element={<AgentHomePage />} />
          <Route path='/vasu' element={<Vasu />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
