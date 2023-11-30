import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { DoorOpen, Mail, Settings, Users2 } from "lucide-react";
import logo from "../../assets/images/ChizMiz-nav.png";
import pic from "../../assets/images/profile-pic.png";
import { fetchUsers } from "../../utils";
import bg from "../../assets/images/background.png";

export function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    fetchUsers(currentUser);
    navigate("/home");
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");
    navigate("/");
  };
  return (
    <div className="dashboard-cont">
      <nav className="sidebar">
        <header>
          <a href="/">
            <img src={logo} alt="ChizMiz-logo" />
          </a>
        </header>
        <div className="option-cont">
          <ul>
            <li>
              <Link to="direct-messages">
                <Mail className="sidebar-icons" />
              </Link>
            </li>
            <li>
              <Link to="channels">
                <Users2 className="sidebar-icons" />
              </Link>
            </li>
            <li>
              <a href="">
                <Settings className="sidebar-icons" />
              </a>
            </li>
          </ul>
        </div>
        <footer>
          <a href="" className="sidebar-profile">
            <img src={pic} alt="" />
            {/* <span>{email}</span> */}
          </a>
          <a onClick={handleLogout}>
            <DoorOpen className="sidebar-icons" />
          </a>
        </footer>
      </nav>
      <main>
        <div className="content-cont">
          <div className="background">
            <img  src={bg} alt="" />
          </div>
          <Outlet />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
