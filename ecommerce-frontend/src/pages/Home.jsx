import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { listProducts } from '../redux/thunks/productThunks'; 
import ProductCard from '../components/ProductCard'; 

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // URL-ൽ നിന്ന് സെർച്ച് കീവേഡ് എടുക്കുന്നു
  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  // Redux സ്റ്റേറ്റിൽ നിന്ന് ഡാറ്റ എടുക്കുന്നു
  const productList = useSelector((state) => state.products);
  const { products, loading, error } = productList || { products: [] };

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  // ബാക്കെൻഡിൽ നിന്ന് ചിലപ്പോൾ ഒരൊറ്റ പ്രോഡക്റ്റോ അല്ലെങ്കിൽ പ്രോഡക്റ്റുകളുടെ ലിസ്റ്റോ വരാം.
  // അത് എറർ ഇല്ലാതെ കൈകാര്യം ചെയ്യാനുള്ള ലോജിക്:
  const getProductsArray = () => {
    if (!products) return [];
    // ബാക്കെൻഡ് റെസ്‌പോൺസ് { products: [...] } എന്നാണെങ്കിൽ:
    if (Array.isArray(products)) return products;
    // ബാക്കെൻഡ് റെസ്‌പോൺസ് { product: {...} } എന്നാണെങ്കിൽ (സിംഗിൾ ഐറ്റം):
    if (typeof products === 'object') return [products];
    return [];
  };

  const finalProducts = getProductsArray();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {keyword ? `Results for "${keyword}"` : 'Discover Our Products'}
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Loading & Error Handling */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Fetching items for you...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto">
          <strong className="font-bold text-lg block mb-1">Oops! Something went wrong</strong>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {finalProducts.length > 0 ? (
            finalProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="text-center col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-2xl font-bold text-gray-700">No Products Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;