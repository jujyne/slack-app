import logo from "../../assets/images/ChizMiz-nav.png";

export function SignUpPage() {
  return (
    <div className="sign-up-cont">
      <nav>
        <a href="/">
          <img src={logo} alt="ChizMiz-logo" />
        </a>
      </nav>
      <main>
        <form>
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <input type="text" placeholder="Confirm password" />
          <button>Sign Up</button>
        </form>
      </main>
    </div>
  );
}
