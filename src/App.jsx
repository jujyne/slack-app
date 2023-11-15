import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage } from "./pages";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/sign-up' element={<SignUpPage/>}></Route>
      </Routes>
    </Router>
  );
}
