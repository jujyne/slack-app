export function LoginPage() {
  return (
    <div className="login-cont">
      <form className="login-box">
        <input type="text" placeholder="Email"/>
        <input type="text" placeholder="Password"/>
        <button>Sign in</button>
      </form>
    </div>
  );
}
