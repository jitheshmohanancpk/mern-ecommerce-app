import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveShippingAddress, clearCart } from '../redux/slices/cartSlice';

const Orders = () => {
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 100; 
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert("Please login to place order");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        shippingAddress: { address, city, postalCode, country },
        itemsPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);

      if (data) {
        alert("Order Placed Successfully! 🎉");
        dispatch(clearCart());
        navigate('/profile'); 
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert(err.response?.data?.message || "Order placing failed.");
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-20">
      <h1 className="text-3xl font-bold mb-8">Checkout & Orders</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Shipping Information</h2>
          <form className="space-y-4" onSubmit={placeOrderHandler}>
            <div>
              <label className="block text-sm text-gray-600">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-lg outline-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 border rounded-lg outline-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-3 border rounded-lg outline-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 border rounded-lg outline-blue-500"
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 rounded-2xl border">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between">
              <span>Items Price:</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-blue-600 pt-4 border-t">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <button
              type="submit"
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || !address}
              className={`w-full py-4 mt-6 rounded-xl font-bold text-white transition ${
                cartItems.length > 0 && address 
                ? 'bg-green-600 hover:bg-green-700 shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;