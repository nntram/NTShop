import { createSlice } from '@reduxjs/toolkit'

const user = sessionStorage.getItem("currentUser");
let init;

const rememberLogin = localStorage.getItem("remember");
if (rememberLogin) {
  const token = localStorage.getItem("userAuth");
  const user = localStorage.getItem("currentUser");
  try {
    const userObj = JSON.parse(user);
    if (token && user && userObj.RefreshTokenExpire <= Date.now()) {
      sessionStorage.setItem("currentUser", user);
      sessionStorage.setItem("userAuth", token);

      if (userObj.Role === "Admin" || userObj.Role === "Staff") {
        init = userObj
      }

    }

  } catch (error) {
    console.log("Init currnet customer error: " + error)
  }
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