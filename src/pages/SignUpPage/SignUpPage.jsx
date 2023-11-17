import logo from "../../assets/images/ChizMiz-nav.png";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] =useState(false);
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault()
    setLoading(true)
  try{let result = await fetch("http://206.189.91.54/api/v1/auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    }),
  });

    result = await result.json();
    localStorage.setItem("currentUser", JSON.stringify(result))
    console.log(result);
    console.log(result.status)
    setLoading(false)
    if(result.status ==='success'){
      navigate("/home")
    }
}catch(error){
  setError(error)
  console.log(result.status)
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
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
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
        </form>
      </main>
    </div>
  );
}
