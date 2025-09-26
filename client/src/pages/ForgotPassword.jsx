import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage("If this email exists, a reset link has been sent.");
      } else {
        setError(data.message || "Request failed");
      }
    } catch (err) {
      setError("Request failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {message && <div className="text-green-600 mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Send Reset Link</button>
      </form>
    </div>
  );
}
