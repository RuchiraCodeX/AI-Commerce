import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Header = ({ cartCount }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg py-6 px-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">
        <Link to="/">AI-Commerce</Link>
      </h1>
      <nav className="flex items-center gap-6">
        <ul className="flex gap-8 text-lg items-center">
          <li>
            <Link to="/" className={`relative px-2 py-1 transition-colors duration-200 hover:text-yellow-300${location.pathname === "/" ? "" : ""}`}>Home</Link>
          </li>
          <li>
            <Link to="/cart" className="relative px-2 py-1 transition-colors duration-200 hover:text-yellow-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.385a2.25 2.25 0 002.183 1.693h7.299a2.25 2.25 0 002.183-1.693l1.7-6.385m-13.148 0h13.148M6.75 21a.75.75 0 100-1.5.75.75 0 000 1.5zm10.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-300 text-blue-900 text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>
              )}
              <span className="ml-1">Cart</span>
            </Link>
          </li>
        </ul>
        {!user ? (
          <Link to="/login" className="ml-6 bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition">Login</Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition">Profile</Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
