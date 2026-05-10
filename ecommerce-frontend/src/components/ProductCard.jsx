import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // നിങ്ങളുടെ ബാക്കെൻഡ് ഡാറ്റയിൽ "images" എന്ന അറേ ഉള്ളതുകൊണ്ട് അതിൽ നിന്ന് ആദ്യത്തെ ഇമേജ് എടുക്കുന്നു
  // അല്ലെങ്കിൽ പഴയ ഡാറ്റയാണെങ്കിൽ നേരിട്ട് image എടുക്കുന്നു
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : product.image;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/product/${product._id}`}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=Image+Error";
          }}
        />
      </Link>

      <div className="p-4">
        <h2 className="text-gray-800 font-bold text-lg truncate">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-black text-gray-900">${product.price}</span>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;