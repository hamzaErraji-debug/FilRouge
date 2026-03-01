import { createSlice } from "@reduxjs/toolkit";

/* ---------- helpers (SSR safe) ---------- */
const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Cart load error", err);
    return [];
  }
};

const saveCart = (items) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (err) {
    console.error("Cart save error", err);
  }
};

/* ---------- slice ---------- */
const CartProgram = createSlice({
  name: "cart-program",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.items.find((p) => p.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveCart(state.items);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) item.quantity += 1;
      saveCart(state.items);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) {








        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((p) => p.id !== action.payload);
        }
      }
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = CartProgram.actions;

export default CartProgram.reducer;
