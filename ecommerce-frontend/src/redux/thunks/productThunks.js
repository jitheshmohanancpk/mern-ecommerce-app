import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. API_URL ഇവിടെ ഡിഫൈൻ ചെയ്യുന്നു (പുറത്ത് നൽകണം)
const API_URL = 'http://localhost:5000/api/products';

export const listProducts = createAsyncThunk(
  'products/listProducts',
  async (keyword = '', { rejectWithValue }) => {
    try {
      // 2. keyword കൃത്യമായി ലഭിക്കാൻ ബാക്ക്ടിക്ക് (`) ഉപയോഗിക്കണം
      const { data } = await axios.get(`${API_URL}?keyword=${keyword}`);
      
      console.log("Success: Data from Backend:", data);
      
      // ബാക്കെൻഡ് റെസ്പോൺസിൽ 'products' എന്ന കീ ഉണ്ടെന്ന് ഉറപ്പാക്കുക
      return data.products; 
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);