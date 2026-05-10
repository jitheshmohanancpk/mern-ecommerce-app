import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// 1. പുതിയ ഓർഡർ ക്രിയേറ്റ് ചെയ്യാൻ
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (order, { getState, rejectWithValue }) => {
    try {
      // Redux സ്റ്റേറ്റിൽ നിന്ന് ലോഗിൻ ചെയ്ത യൂസറുടെ ടോക്കൺ എടുക്കുന്നു
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(API_URL, order, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// 2. ഒരു പ്രത്യേക ഓർഡറിന്റെ വിവരങ്ങൾ എടുക്കാൻ (Order Details)
export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);