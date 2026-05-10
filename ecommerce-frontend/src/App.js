import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import Cart from './pages/Cart';

import OrderDetails from './pages/OrderDetails';




function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/login" element={<Login />} />
            
            
            
            
            {/* Product Details Route */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />

            <Route path="/order/:id" element={<OrderDetails />} />
            

            <Route path="/cart" element={<Cart />} />  
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;