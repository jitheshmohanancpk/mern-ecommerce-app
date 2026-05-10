// src/redux/slices/productSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { listProducts } from '../thunks/productThunks';

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // ഡാറ്റ ഇവിടെ സേവ് ആകുന്നു
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;