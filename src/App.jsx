import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, LoginPage, SignUpPage } from "./pages";
import {
  CreateChannel,
  GetChannelDetails,
  RetrieveMessage,
  SendMessage,
} from "./components";
import { DirectMessages, NewMessage } from "./pages/Dashboard";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignUpPage />}></Route>
        <Route path="/home" element={<Dashboard />}>
          <Route path="direct-messages" element={<DirectMessages />} />
          <Route path="inbox" element={<RetrieveMessage />} />
          <Route path="new-message" element={<NewMessage />} />
          <Route path="create-channel" element={<CreateChannel />} />
          <Route path="channels" element={<GetChannelDetails />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}
