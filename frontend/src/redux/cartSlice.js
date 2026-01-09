import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
    },
    removeFromCart: (state, action) => {
      let newArr = [...state.cartItems];
      newArr.splice(action.payload, 1);
      state.cartItems = newArr;
    },
    updateCart: (state, action) => {
      let arr = [...state.cartItems];
      let index = arr.findIndex(
        (food) =>
          food.id === action.payload.id && food.size === action.payload.size
      );
      if (index !== -1) {
        arr[index] = {
          ...arr[index],
          qty: parseInt(action.payload.qty) + arr[index].qty,
          price: action.payload.price + arr[index].price,
        };
        state.cartItems = arr;
      }
    },
    dropCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCart, dropCart } =
  cartSlice.actions;
export default cartSlice.reducer;
