import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import customerSlice from "./slices/customerSlice";
import staffSlice from "./slices/staffSlice";

 const store = configureStore({
    reducer:{
        cart: cartSlice,
        customer: customerSlice,
        staff: staffSlice
    }
 })

 export default store;