import { createSlice } from '@reduxjs/toolkit';
import { createOrder, getOrderDetails } from '../thunks/orderThunks';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    loading: false,
    success: false,
    order: null,
    error: null,
  },
  reducers: {
    // ഓർഡർ സക്സസ് ആയതിന് ശേഷം സ്റ്റേറ്റ് റീസെറ്റ് ചെയ്യാൻ
    createOrderReset: (state) => {
      state.success = false;
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2. Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { createOrderReset } = orderSlice.actions;
export default orderSlice.reducer;