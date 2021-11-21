import './App.css';
import MintPage from './views/mintingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React, { useEffect } from 'react';
import FightPage from './views/fightPage';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<MintPage />} />
          <Route path="/fight" element={<FightPage />} />
        </Routes>
      </Router>
    </>);
}

export default App;
