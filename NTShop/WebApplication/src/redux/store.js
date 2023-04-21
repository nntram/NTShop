import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import customerSlice from "./slices/customerSlice";

 const store = configureStore({
    reducer:{
        cart: cartSlice,
        customer: customerSlice
    }
 })

 export default store;