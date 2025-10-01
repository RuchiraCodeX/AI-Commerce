export default function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // new state for admin
  const [error, setError] = useState("");

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdmin }), // add isAdmin to body
      });
      const data = await res.json();
      if (data.token) {
        await login(data.token);
        // user will be redirected by useEffect
        if (isAdmin) {
          // redirect to admin dashboard
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  // New form field for admin
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="checkbox" className="mr-2" onChange={e => setIsAdmin(e.target.checked)} /> Admin
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        <Link to="/forgot" className="text-blue-600 hover:underline">Forgot password?</Link>
      </div>
    </div>
  );
}