import React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { Chat } from './Pages/Chat';

function App() {
  return (
    <div className="App">
      <ColorModeSwitcher justifySelf="flex-end" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
