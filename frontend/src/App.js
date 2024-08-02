import React from 'react';
import Login from "./Login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Admin from './Admin';
import CreateRoom from './CreateRoom';
import UpdateRoom from './UpdateRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/create" element={<CreateRoom />}></Route>
        <Route path="/admin/update/:id" element={<UpdateRoom />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
