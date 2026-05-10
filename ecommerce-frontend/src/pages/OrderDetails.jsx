import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userData = localStorage.getItem('userInfo');
        const parsedData = userData ? JSON.parse(userData) : null;
        
        // 🟢 പ്രധാന മാറ്റം: Token എടുക്കുന്ന രീതി
        // ലോഗിൻ ചെയ്യുമ്പോൾ കിട്ടുന്ന റെസ്‌പോൺസ് അനുസരിച്ച് ഇതിൽ മാറ്റം വരാം
        const token = parsedData?.token || parsedData?.userInfo?.token;

        if (!token) {
          setError("Login token missing. Please login again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        // 🟢 Backend URL ശ്രദ്ധിക്കുക. നിങ്ങളുടെ ബാക്കെൻഡ് പോർട്ട് 5000 ആണെന്ന് ഉറപ്പുവരുത്തുക.
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
        
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error("API Fetch Error:", err.response);
        // ബാക്കെൻഡിൽ നിന്നുള്ള കൃത്യമായ എറർ മെസ്സേജ് കാണിക്കുന്നു
        setError(err.response?.data?.message || "Order detail fetch ചെയ്യാൻ സാധിച്ചില്ല.");
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return <div className="text-center p-20 font-bold">Loading Order Details...</div>;
  
  if (error) return (
    <div className="text-center p-20 text-red-500">
      <p className="font-bold">{error}</p>
      <Link to="/profile" className="text-blue-500 underline mt-4 block">Back to Profile</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg mt-10 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-700">Order ID: {order?._id}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2 text-blue-600">Shipping</h2>
          <p><strong>Name:</strong> {order?.user?.name || "Customer"}</p>
          <p><strong>Address:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
          <div className={`mt-2 p-2 text-sm font-bold rounded ${order?.isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {order?.isDelivered ? `Delivered on ${order.deliveredAt}` : "Not Delivered"}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2 text-blue-600">Payment</h2>
          <p><strong>Total Amount:</strong> ₹{order?.totalPrice}</p>
          <div className={`mt-2 p-2 text-sm font-bold rounded ${order?.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {order?.isPaid ? `Paid on ${order.paidAt?.substring(0, 10)}` : "Payment Pending"}
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ordered Items</h2>
        {order?.orderItems?.length > 0 ? (
          order.orderItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow" />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="font-bold">{item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</span>
            </div>
          ))
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;