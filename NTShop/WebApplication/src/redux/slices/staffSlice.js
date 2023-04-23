import { createSlice } from '@reduxjs/toolkit'

const user = sessionStorage.getItem("currentUser");
let init = null
try {
  const obj = JSON.parse(user)
  if(obj.Role === 'Staff' || obj.Role === 'Admin')
  {
    init = obj;
  }
} catch (error) {
  init = null
}

const initialState = {
    currentStaff: init
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setCurrentStaff: (state, action) => {
      const data = action.payload
      state.currentStaff = data
    }

  }
});

export const staffActions = staffSlice.actions

export default staffSlice.reducer