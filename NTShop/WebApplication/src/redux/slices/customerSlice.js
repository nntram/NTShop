import { createSlice } from '@reduxjs/toolkit'

const user = sessionStorage.getItem("currentUser");
let init = {}
try {
  init = JSON.parse(user)
} catch (error) {
  init = null
}

const initialState = {
  currentUser: init
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const data = action.payload
      state.currentUser = data
    }

  }
});

export const customerActions = customerSlice.actions

export default customerSlice.reducer