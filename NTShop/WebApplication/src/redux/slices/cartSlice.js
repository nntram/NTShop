import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    totalQuantity: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTotalQuatity: (state, action) => {
        const quantity = action.payload        
        state.totalQuantity = quantity                     
    },

  }
});

export const cartActions = cartSlice.actions

export default cartSlice.reducer