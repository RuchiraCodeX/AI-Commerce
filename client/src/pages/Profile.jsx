import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import Header from "../Components/Header";

export default function Profile({ cart = [] }) {
  const { user, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    // TODO: Add profile picture upload logic
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, profilePic }),
      });
      const data = await res.json();
      if (data._id) {
        setUser(data);
        setEditing(false);
        setMessage("Profile updated!");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      setMessage("Update failed");
    }
  };

  if (!user) return <div className="text-center mt-16">Loading...</div>;

  return (
    <>
      <Header cartCount={cart.length} />
      <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-xl shadow">
        <div className="flex flex-col items-center mb-6">
          <img src={user.profilePic || "/vite.svg"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 mb-2" />
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <button onClick={logout} className="text-red-600 hover:underline text-sm">Logout</button>
        </div>
        {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="url" className="w-full border rounded px-3 py-2" value={profilePic} onChange={e => setProfilePic(e.target.value)} placeholder="Profile picture URL" />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save</button>
          </form>
        ) : (
          <button onClick={() => setEditing(true)} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Edit Profile</button>
        )}
  {/* Cart details removed as requested */}
      </div>
    </>
  );
}
