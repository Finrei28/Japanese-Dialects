import './App.css';
import React from 'react';
import Homepage from './pages/homepage';
import Navbar from './componenets/navbar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminPage from './pages/adminpage';
import ResetPasswordPage from './pages/resetPasswordPage'

function App() {
  let location = useLocation();
  return (
    <div className="App">
      <header className="App-header">
        {location.pathname !== "/dashboard" && location.pathname !== "/admin/resetPassword" && <Navbar/>}
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/dashboard" element={<AdminPage/>}/>
          <Route path="/admin/resetPassword" element={<ResetPasswordPage/>}/>
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
