import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    selectedOffer: null,
    newAdded: false
};

const partnerOffersSlice = createSlice({
    name: 'partnerOffers',
    initialState,
    reducers: {
        addPartnerOffer: (state, action) => {
            state.newAdded = true;
        },
        removePartnerOffer: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id);
        },
        updatePartnerOffer: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index >= 0) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },
        selectPartnerOffer: (state, action) => {
            state.selectedOffer = action.payload;
        },
        clearSelectedPartnerOffer: (state) => {
            state.selectedOffer = null;
        }
    }
});

export const { addPartnerOffer, removePartnerOffer, updatePartnerOffer, selectPartnerOffer, clearSelectedPartnerOffer } =
    partnerOffersSlice.actions;
export default partnerOffersSlice.reducer;
