import React, { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", description: "", category: "", images: [""] });
  const [editingId, setEditingId] = useState(null);

  // Fetch products
  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/products/${editingId}` : "/products";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save product");
      const saved = await res.json();
      if (editingId) {
        setProducts((ps) => ps.map((p) => (p._id === editingId ? saved : p)));
      } else {
        setProducts((ps) => [...ps, saved]);
      }
      setForm({ title: "", price: "", description: "", category: "", images: [""] });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit product
  const handleEdit = (p) => {
    setForm({
      title: p.title || "",
      price: p.price || "",
      description: p.description || "",
      category: p.category || "",
      images: p.images || [""]
    });
    setEditingId(p._id);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((ps) => ps.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-gray-50 p-4 rounded-lg">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded w-full" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="border p-2 rounded w-full" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded w-full" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded w-full" />
        <input name="images" value={form.images[0]} onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))} placeholder="Image URL" className="border p-2 rounded w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
          {editingId ? "Update" : "Add"} Product
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", price: "", description: "", category: "", images: [""] }); }} className="ml-2 text-gray-500">Cancel</button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Title</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
