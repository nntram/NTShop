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
        && userObj.Role === "Customer") {
      sessionStorage.setItem("currentUser", user);
      sessionStorage.setItem("userAuth", token);
    }

  } catch (error) {
    console.log("Init currnet customer error: " + error)
  }
}

const user = sessionStorage.getItem("currentUser");
try{
  let userObj 
  if (user){
    userObj = JSON.parse(user);
  } 
  if(userObj && userObj.Role === "Customer"){
    init = userObj
  }
}catch(error){
  console.log("Init currnet customer error: " + error)
}

const initialState = {
  currentUser: init
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      if(action === "RESET"){
        state.currentUser = initialState;
        console.log(state.currentUser)
      }
      const data = action.payload
      state.currentUser = data
    }

  }
});

export const customerActions = customerSlice.actions

export default customerSlice.reducer