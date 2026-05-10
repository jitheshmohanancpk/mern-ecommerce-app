import { configureStore } from '@reduxjs/toolkit';

import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice'; 
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    userLogin: authReducer, // ഫയൽ authSlice ആണെങ്കിലും സ്റ്റേറ്റിൽ userLogin എന്ന് തന്നെ നൽകാം
    orderCreate: orderReducer,
  },
});

export default store;