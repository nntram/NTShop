import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    totalQuantity: -100,
    totalAmount: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTotalQuatity: (state, action) => {
        const quantity = action.payload        
        state.totalQuantity = quantity                     
    },

    setTotalAmount: (state, action) => {
      const amount = action.payload        
      state.totalAmount = amount                     
  },

  }
});

export const cartActions = cartSlice.actions

export default cartSlice.reducer