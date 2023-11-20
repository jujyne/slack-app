import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { DoorOpen, Mail, Settings, Users2 } from "lucide-react";
import logo from "../../assets/images/ChizMiz-nav.png";
import pic from "../../assets/images/profile-pic.png";
import { SearchBar } from "../../components";

export function Dashboard() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    setEmail(currentUser.data.email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  return (
    <div className="dashboard-cont">
      <header>
        <a href="/">
          <img src={logo} alt="ChizMiz-logo" />
        </a>
      </header>
      <main>
      <nav className="sidebar">
        <div className="option-cont">
          <SearchBar />
         
          <ul>
            <li>
              <a href="">
                <Mail className="sidebar-icons" /> Inbox
              </a>
            </li>
            <li>
              <a href="">
                <Users2 className="sidebar-icons" /> Channel
              </a>
            </li>
            <li>
              <a href="">
                <Settings className="sidebar-icons" /> Settings
              </a>
            </li>
            <li>
              <Link to='/home/send-message'>Send Message</Link>
            </li>
          </ul>
        </div>
        <footer>
          <a href="" className="sidebar-profile">
            <img src={pic} alt="" />
            <span>{email}</span>
          </a>
          <a onClick={handleLogout}>
            <DoorOpen className="sidebar-icons" /> Logout
          </a>
        </footer>
      </nav>
        <div className="content-cont"><Outlet/></div>
      </main>

      
      <footer></footer>
    </div>
  );
}
