import { useState } from "react";

interface Props {
  onLogin: () => void;
}

const USER = { username: "admin01", password: "Admin1234" };

export default function Login({ onLogin }: Props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user.length < 4) {
      setError("Username must be at least 4 characters");
      return;
    }
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passRegex.test(pass)) {
      setError("Password must contain 8+ chars, 1 uppercase and 1 number");
      return;
    }
    if (user !== USER.username || pass !== USER.password) {
      setError("Invalid username or password");
      return;
    }
    localStorage.setItem("auth", "true");
    onLogin();
  };

  return (
    <div className="page">
      <div className="card login">
        <h1>🔐 Login</h1>
        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button onClick={handleLogin}>Sign In</button>
        {error && <div className="warning">{error}</div>}
        <small className="hint">Test: admin01 / Admin1234</small>
      </div>
    </div>
  );
}