import { createSlice } from '@reduxjs/toolkit'

let init;

const rememberLogin = localStorage.getItem("remember");
const curentToken = sessionStorage.getItem("userAuth");

if (rememberLogin === "true" && !curentToken) {
  const token = localStorage.getItem("userAuth");
  const user = localStorage.getItem("currentUser");
  try {
    let userObj 
    if (token && user){
      userObj = JSON.parse(user);
    } 

    if (userObj
      && userObj.RefreshTokenExpire >= Math.floor(Date.now() / 1000)
      && (userObj.Role === "Admin" || userObj.Role === "Staff")) {
      sessionStorage.setItem("currentUser", user);
      sessionStorage.setItem("userAuth", token);
    }

  } catch (error) {
    console.log("Init currnet staff error: " + error)
  }
}

const user = sessionStorage.getItem("currentUser");

try {
  let userObj 
  if (user){
    userObj = JSON.parse(user);
  } 
  if (userObj && (userObj.Role === "Admin" || userObj.Role === "Staff")) {
    init = userObj
  }
} catch (error) {
  console.log("Init currnet staff error: " + error)
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