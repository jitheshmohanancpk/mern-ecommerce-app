import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ കാർട്ടിലേക്ക് ആഡ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const addToCartHandler = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      stock: product.stock,
      quantity: 1
    }));
    alert("Item added to cart!");
  };

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading Product Details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 md:p-20">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <img 
            src={product.images?.[0]?.url || 'https://via.placeholder.com/500'}
            alt={product.name} 
            className="rounded-xl shadow-md max-h-[400px] object-cover w-full"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-3xl font-black text-blue-600 mr-4">₹{product.price}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={addToCartHandler} //ക്ലിക്ക് ചെയ്യുമ്പോൾ കാർട്ടിലേക്ക് പോകും
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-xl font-bold transition ${
                product.stock > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
              ❤️
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 italic">
            * Free delivery available on orders above ₹1000
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;