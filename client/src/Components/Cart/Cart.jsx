import React from "react";

function getItemPrice(item) {
  // Support both { price } and { productId: { price } }
  if (typeof item.price === 'number') return item.price;
  if (item.productId && typeof item.productId.price === 'number') return item.productId.price;
  return 0;
}

function Cart({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + getItemPrice(item) * item.qty, 0);
  const subtotal = total;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!cart.length) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-3">🛒 Your Cart</h2>
        <p className="text-gray-500">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col border border-gray-100">
      <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>
      <ul className="space-y-4 flex-1">
        {cart.map((item) => {
          const price = getItemPrice(item);
          const title = item.title || (item.productId && item.productId.title) || 'Product';
          return (
            <li
              key={item._id || (item.productId && item.productId._id)}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2">{title}</h3>
                <p className="text-xs text-gray-500">${price.toFixed(2)} x {item.qty} = <span className="font-semibold text-green-700">${(price * item.qty).toFixed(2)}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id || (item.productId && item.productId._id), item.qty - 1)}
                  disabled={item.qty <= 1}
                  className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg font-bold disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-2 font-semibold">{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item._id || (item.productId && item.productId._id), item.qty + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    // Always use productId for backend removal
                    const id = item.productId && item.productId._id ? item.productId._id : item._id;
                    removeFromCart(id);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Cart summary */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal ({itemCount} items):</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Shipping:</span>
          <span className="font-semibold">$0.00</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Checkout
      </button>
    </div>
  );
}

export default Cart;
