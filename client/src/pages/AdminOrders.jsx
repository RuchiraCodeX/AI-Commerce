import React, { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    fetch("/cart", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatusMap((m) => ({ ...m, [orderId]: value }));
  };

  const handleUpdateStatus = async (orderId) => {
    const status = statusMap[orderId];
    if (!status) return;
    try {
      const res = await fetch(`/cart/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setOrders((os) => os.map((o) => (o._id === orderId ? updated : o)));
      setStatusMap((m) => ({ ...m, [orderId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Items</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-2 text-xs">{order._id}</td>
                <td className="p-2 text-xs">{order.userId?.email || order.userId?._id}</td>
                <td className="p-2 text-xs">
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.productId?.title || item.productId?._id} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">${order.totalPrice}</td>
                <td className="p-2">{order.status || "pending"}</td>
                <td className="p-2">
                  <select
                    value={statusMap[order._id] || ""}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Change</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(order._id)}
                    className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
