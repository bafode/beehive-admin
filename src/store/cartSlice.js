import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const payload = action.payload;
            const existingEventIndex = state.items.findIndex(
                (item) => item.eventId === payload.eventId && item.ticketCategoryId === payload.ticketCategoryId
            );

            if (existingEventIndex >= 0) {
                // Update the existing item
                state.items[existingEventIndex] = {
                    ...state.items[existingEventIndex],
                    ...payload
                };
                return;
            }
            state.items.push(payload);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.eventId !== action.payload.eventId || item.ticketCategoryId !== action.payload.ticketCategoryId
            );
        }
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
