/**
 * Wishlist Slice
 * Synced to Firestore per-user for persistence across devices
 */

import {createSlice, createSelector} from '@reduxjs/toolkit';

const initialState = {
  items: [], // product objects
  syncing: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const idx = state.items.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(product);
      }
    },
    setWishlist: (state, action) => {
      state.items = action.payload || [];
    },
    clearWishlist: state => {
      state.items = [];
    },
    setSyncing: (state, action) => {
      state.syncing = action.payload;
    },
  },
});

export const {toggleWishlist, setWishlist, clearWishlist, setSyncing} =
  wishlistSlice.actions;

export const selectWishlistItems = state => state.wishlist.items;

export const selectIsWishlisted = id =>
  createSelector([selectWishlistItems], items =>
    items.some(i => i.id === id),
  );

export default wishlistSlice.reducer;
