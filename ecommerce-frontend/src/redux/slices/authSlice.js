import { createSlice } from '@reduxjs/toolkit';

// LocalStorage-ൽ നിന്ന് യൂസർ ഉണ്ടോ എന്ന് നോക്കുന്നു. ഉണ്ടെങ്കിൽ അത് Initial State ആക്കുന്നു.
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    // ലോഗിൻ പ്രോസസ് തുടങ്ങുമ്പോൾ
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // ലോഗിൻ സക്സസ് ആകുമ്പോൾ
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
    },
    // ലോഗിൻ ഫെയിൽ ആകുമ്പോൾ
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // ലോഗൗട്ട് ചെയ്യുമ്പോൾ
    userLogout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('userInfo');
    },
  },
});

// ആക്ഷനുകൾ എക്സ്പോർട്ട് ചെയ്യുന്നു
export const { loginRequest, loginSuccess, loginFail, userLogout } = authSlice.actions;

// റെഡ്യൂസർ എക്സ്പോർട്ട് ചെയ്യുന്നു (ഇതാണ് store.js-ലേക്ക് പോകുന്നത്)
export default authSlice.reducer;