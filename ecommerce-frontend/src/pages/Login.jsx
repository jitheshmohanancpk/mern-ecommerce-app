import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // ബാക്കെൻഡിലേക്ക് ഡാറ്റ അയക്കുന്നു
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );

      console.log("Login Success:", data);
      
      // ലോഗിൻ വിവരങ്ങൾ ലോക്കൽ സ്റ്റോറേജിൽ സേവ് ചെയ്യുന്നു
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      alert('Login Successful!');
      navigate('/'); // ലോഗിൻ കഴിഞ്ഞാൽ ഹോം പേജിലേക്ക് പോകാൻ
    } catch (error) {
      alert(error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter email" 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter password" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;