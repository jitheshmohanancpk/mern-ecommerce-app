import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems')) 
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find(i => i._id === item._id);

            if (isItemExist) {
                // ഐറ്റം നേരത്തെ ഉണ്ടെങ്കിൽ അതിന്റെ ക്വാണ്ടിറ്റി മാത്രം അപ്‌ഡേറ്റ് ചെയ്യുന്നു
                state.cartItems = state.cartItems.map(i =>
                    i._id === isItemExist._id ? item : i
                );
            } else {
                // പുതിയ ഐറ്റം അറേയിലേക്ക് ചേർക്കുന്നു
                state.cartItems.push(item);
            }
            // ലോക്കൽ സ്റ്റോറേജ് അപ്‌ഡേറ്റ്
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeItemFromCart: (state, action) => {
            // ഐറ്റം നീക്കം ചെയ്യുന്നു
            state.cartItems = state.cartItems.filter(i => i._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
        },
        // ഓർഡർ കംപ്ലീറ്റ് ആയാൽ കാർട്ട് ക്ലിയർ ചെയ്യാനുള്ള ഫംഗ്ഷൻ (Optional)
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        }
    }
});

export const { addToCart, removeItemFromCart, saveShippingAddress, clearCart } = cartSlice.actions;
export default cartSlice.reducer;