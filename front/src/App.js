import './App.css';
import React from 'react';
import Homepage from './components/homepage';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminPage from './components/adminpage';

function App() {
  let location = useLocation();
  return (
    <div className="App">
      <header className="App-header">
        {location.pathname !== "/dashboard" && <Navbar/>}
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/dashboard" element={<AdminPage/>}/>
        </Routes>
      </header>
    </div>
  );
}


function AppWrapper() {
  return (
    <Router>
      <App/>
    </Router>
  )
}
export default AppWrapper;
