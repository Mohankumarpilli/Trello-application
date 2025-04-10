import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import listReducer from './slices/listSlice';
import cardReducer from './slices/cardSlice';
import checklistReducer from './slices/checklistSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    lists: listReducer,
    cards: cardReducer,
    checklists: checklistReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});