import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// SearchBox കൃത്യമായി ഇമ്പോർട്ട് ചെയ്യുന്നു
import SearchBox from './SearchBox';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart State - സേഫ്റ്റി ചെക്ക് സഹിതം
  const cart = useSelector((state) => state.cart);
  const { cartItems = [] } = cart || {};
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('userInfo');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        const finalUser = parsedData.userInfo ? parsedData.userInfo : parsedData;
        setUser(finalUser);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
    // സെഷൻ ക്ലിയർ ചെയ്യാൻ വിൻഡോ റീലോഡ് ചെയ്യുന്നു
    window.location.reload();
  };

  const nameToShow = user?.name || user?.username || "User";

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          MyStore
        </Link>
        
        {/* SearchBox - Desktop & Mobile */}
        <div className="flex-1 max-w-md mx-4 order-3 md:order-none w-full md:w-auto">
          <SearchBox />
        </div>

        {/* Right Side Icons & User Info */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-blue-600 transition p-2">
            <span className="text-2xl">🛒</span>
            <span className="hidden sm:block font-semibold text-gray-700">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {cartItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0)}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3 md:gap-4 border-l pl-4 md:pl-6 border-gray-200">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="bg-blue-600 h-9 w-9 rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition">
                  {nameToShow.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block font-semibold text-gray-700 group-hover:text-blue-600 transition">
                  {nameToShow}
                </span>
              </Link>

              <button 
                onClick={logoutHandler} 
                className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;