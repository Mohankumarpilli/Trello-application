import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    boardFormVisible: false,
    listFormVisible: false,
    cardFormVisibleMap: {}, // Maps list IDs to form visibility: { [listId]: boolean }
    cardDialogOpen: false,
  },
  reducers: {
    toggleBoardForm: (state, action) => {
      state.boardFormVisible = action.payload !== undefined ? action.payload : !state.boardFormVisible;
    },
    toggleListForm: (state, action) => {
      state.listFormVisible = action.payload !== undefined ? action.payload : !state.listFormVisible;
    },
    toggleCardForm: (state, action) => {
      const { listId, isVisible } = action.payload;
      state.cardFormVisibleMap[listId] = isVisible !== undefined ? isVisible : !state.cardFormVisibleMap[listId];
    },
    toggleCardDialog: (state, action) => {
      state.cardDialogOpen = action.payload !== undefined ? action.payload : !state.cardDialogOpen;
    }
  }
});

export const { 
  toggleBoardForm, 
  toggleListForm, 
  toggleCardForm, 
  toggleCardDialog 
} = uiSlice.actions;

export default uiSlice.reducer;