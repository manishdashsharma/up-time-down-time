import React from 'react';
import './App.css';
import axios from 'axios'
import Authentication from './Pages/Authentication/Authentication'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Authentication />} />
      </Routes>
      <ToastContainer />
      </Router>
    
  );
}
axios.defaults.baseURL = "https://up-time-down-time.vercel.app//api/v1"
export default App;
