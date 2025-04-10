import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trelloApi } from '../../utils/api';

// Async thunks
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await trelloApi.getBoardsDetails();
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardName, { rejectWithValue }) => {
    try {
      const response = await trelloApi.postBoard(boardName);
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to create board');
    }
  }
);

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
    items: [],
    loading: false,
    error: null,
    boardName: '',
  },
  reducers: {
    setBoardName: (state, action) => {
      state.boardName = action.payload;
    },
    resetBoardName: (state) => {
      state.boardName = '';
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch boards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.boardName = '';
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBoardName, resetBoardName, clearError } = boardSlice.actions;
export default boardSlice.reducer;