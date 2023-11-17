import logo from "../../assets/images/ChizMiz-nav.png";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || false
  );
  const navigate = useNavigate();

  useEffect(()=>{
    if(currentUser && currentUser.isLoggedIn){
      navigate("/home")
    }
  }, [])

  async function handleSignUp(event) {
    event.preventDefault();
    setLoading(true);
    try {
      let data = await fetch("http://206.189.91.54/api/v1/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      setData(data = await data.json())
      console.log(data);
      console.log(data.status);
      setLoading(false);
      
      if (data.status === "success") {
        navigate("/");
      }
    } catch (error) {
      setError(error);
      console.log(data.status);
    }
  }

  return (
    <div className="sign-up-cont">
      <nav>
        <a href="/">
          <img src={logo} alt="ChizMiz-logo" />
        </a>
      </nav>
      <main>
        <form onSubmit={handleSignUp}>
          <h1>Create an Account</h1>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <button type="submit">Sign Up</button>
          <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
        </form>
      </main>
    </div>
  );
}
