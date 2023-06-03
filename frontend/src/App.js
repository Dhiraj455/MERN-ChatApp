import React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import './App.css';
import Home from './Pages/Home';

function App() {
  return (
    <div className="App">
      <ColorModeSwitcher justifySelf="flex-end" />
      <Home />
    </div>
  );
}

export default App;
