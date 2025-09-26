import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav className="flex gap-4">
          <Link to="/admin/products" className="hover:underline">Products</Link>
          <Link to="/admin/orders" className="hover:underline">Orders</Link>
          <Link to="/admin/users" className="hover:underline">Users</Link>
        </nav>
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
