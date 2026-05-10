import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [orders, setOrders] = useState([]); // Default ആയി empty array നൽകി
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);

        // 🟢 ERROR FIX: ബാക്കെൻഡ് റിസൾട്ട് അറേ ആണോ എന്ന് പരിശോധിക്കുന്നു
        // ബാക്കെൻഡ് നേരിട്ട് അറേ അയച്ചാൽ 'data', അല്ലെങ്കിൽ 'data.orders' എടുക്കുന്നു
        const fetchedOrders = Array.isArray(data) ? data : (data.orders || []);
        setOrders(fetchedOrders);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // എറർ വന്നാൽ ബ്ലാങ്ക് അറേ നൽകുന്നു
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  if (!userInfo) return null;

  return (
    <div className="container mx-auto p-4 md:p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>
      
      {/* User Information Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
        <div className="flex flex-col gap-2">
          <p className="text-lg"><strong>Name:</strong> {userInfo.name}</p>
          <p className="text-lg text-gray-600"><strong>Email:</strong> {userInfo.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      
      {loading ? (
        <div className="flex justify-center p-10">
          <p className="animate-pulse text-blue-600 font-medium">Loading orders...</p>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">DATE</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">PAID</th>
                <th className="p-4">DELIVERED</th>
                <th className="p-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition text-gray-700">
                  <td className="p-4 font-mono text-xs">{order._id}</td>
                  <td className="p-4">{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                  <td className="p-4 font-bold text-gray-900">₹{order.totalPrice}</td>
                  <td className="p-4">
                    {order.isPaid ? (
                      <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">Paid</span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-semibold border border-red-100">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    {order.isDelivered ? (
                      <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">Delivered</span>
                    ) : (
                      <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-semibold border border-orange-100">Processing</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Link 
                      to={`/order/${order._id}`} 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm active:scale-95 inline-block text-center"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-xl text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">You have no orders yet.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Start Shopping →</Link>
        </div>
      )}
    </div>
  );
};

export default Profile;