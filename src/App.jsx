import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, DirectMessages, Channels, LoginPage, SignUpPage, PageNotFound } from "./pages";




export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignUpPage />}></Route>
        <Route path="/home" element={<Dashboard />}>
          <Route path="direct-messages" element={<DirectMessages />} />
          <Route path="channels" element={<Channels/>}></Route>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </Router>
  );
}
