import { createSlice } from '@reduxjs/toolkit'


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

      if (userObj.Role === "Customer") {
        init = userObj
      }

    }

  } catch (error) {
    console.log("Init currnet customer error: " + error)
  }
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