import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItemFromCart, addToCart } from '../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { cartItems } = useSelector((state) => state.cart);

  // പ്രൊഡക്റ്റിന്റെ എണ്ണം മാറ്റാൻ
  const qtyHandler = (item, qty) => {
    if (qty < 1 || qty > item.stock) return;
    dispatch(addToCart({ ...item, quantity: qty }));
  };

  // കാർട്ടിൽ നിന്ന് ഒഴിവാക്കാൻ
  const removeFromCartHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  // വില കണക്കാക്കുന്നു
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-blue-50 p-10 rounded-2xl text-center">
          <p className="text-xl text-gray-600 mb-4">Your cart is currently empty!</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={item.image} alt={item.name} className="h-24 w-24 object-cover rounded-lg" />
                
                <div className="flex-1 ml-6">
                  <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => qtyHandler(item, item.quantity - 1)}
                      className="bg-gray-200 h-8 w-8 rounded-full font-bold hover:bg-gray-300"
                    >-</button>
                    <span className="font-medium text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => qtyHandler(item, item.quantity + 1)}
                      className="bg-gray-200 h-8 w-8 rounded-full font-bold hover:bg-gray-300"
                    >+</button>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCartHandler(item._id)}
                  className="text-red-400 hover:text-red-600 text-xl p-2"
                  title="Remove Item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Subtotal</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Total Items:</span>
                <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-800 pt-2">
                <span>Total:</span>
                <span>₹{itemsPrice}</span>
              </div>
            </div>

            {/* 👈 ഇതാണ് അപ്‌ഡേറ്റ് ചെയ്ത ബട്ടൺ */}
            <button 
              onClick={() => navigate('/orders')} 
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white mt-6 transition duration-300 ${
                cartItems.length > 0 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4 italic">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;