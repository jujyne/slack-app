import logo from "../../assets/images/ChizMiz-nav.png";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { PulseLoader} from "react-spinners";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || false
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      navigate("/home");
    }
  }, []);

  async function handleSignUp(event) {
    event.preventDefault();
    setLoading(true);
    try {
      let data = await fetch("http://206.189.91.54/api/v1/auth/", {
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

      setData((data = await data.json()));
      console.log(data);
      console.log(data.status);
      setLoading(false);

      if (data.status === "success") {
        navigate("/");
        toast.success("User created successfully")
      } else {
        data.errors.full_messages.map((e) =>
          toast.error(e, {
            style: {
              color: "#f659a3",
            },
          })
        );
      }
    } catch (error) {
      console.log(error);
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
          <button type="submit">
            {loading ? (
              <PulseLoader color={"white"} size={"0.5rem"} />
            ) : (
              "Sign Up"
            )}
          </button>
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </main>
      
    </div>
  );
}
