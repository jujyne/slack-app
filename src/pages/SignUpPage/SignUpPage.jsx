

export function SignUpPage() {
  return (
    <div className="sign-up-cont">
      <form>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name"/>
        <input type="text" placeholder="Email"/>
        <input type="text" placeholder="Password"/>
        <input type="text" placeholder="Confirm password"/>
        <button>Sign Up</button>
      </form>
    </div>
  );
}