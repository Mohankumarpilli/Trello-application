import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trelloApi } from '../../utils/api';

// Async thunks
export const fetchChecklists = createAsyncThunk(
  'checklists/fetchChecklists',
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await trelloApi.getCardChecklists(cardId);
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch checklists');
    }
  }
);

export const createChecklist = createAsyncThunk(
  'checklists/createChecklist',
  async ({ cardId, name }, { rejectWithValue }) => {
    try {
      const response = await trelloApi.createChecklist(cardId, name);
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to create checklist');
    }
  }
);

export const deleteChecklist = createAsyncThunk(
  'checklists/deleteChecklist',
  async (checklistId, { rejectWithValue }) => {
    try {
      await trelloApi.deleteChecklist(checklistId);
      return checklistId;
    } catch (err) {
      return rejectWithValue('Failed to delete checklist');
    }
  }
);

export const createCheckItem = createAsyncThunk(
  'checklists/createCheckItem',
  async ({ checklistId, name }, { rejectWithValue }) => {
    try {
      const response = await trelloApi.createCheckItem(checklistId, name);
      return { checklistId, item: response.data };
    } catch (err) {
      return rejectWithValue('Failed to create check item');
    }
  }
);

export const deleteCheckItem = createAsyncThunk(
  'checklists/deleteCheckItem',
  async ({ checklistId, itemId }, { rejectWithValue }) => {
    try {
      await trelloApi.deleteCheckItem(checklistId, itemId);
      return { checklistId, itemId };
    } catch (err) {
      return rejectWithValue('Failed to delete check item');
    }
  }
);

export const toggleCheckItem = createAsyncThunk(
  'checklists/toggleCheckItem',
  async ({ cardId, itemId, currentState }, { rejectWithValue }) => {
    try {
      const newState = currentState === 'complete' ? 'incomplete' : 'complete';
      await trelloApi.updateCheckItem(cardId, itemId, newState);
      return { itemId, newState };
    } catch (err) {
      return rejectWithValue('Failed to toggle check item');
    }
  }
);

const checklistSlice = createSlice({
  name: 'checklists',
  initialState: {
    items: [],
    newCheckItemNames: {},
    newChecklistName: '',
    loading: false,
    error: null,
  },
  reducers: {
    setNewChecklistName: (state, action) => {
      state.newChecklistName = action.payload;
    },
    resetNewChecklistName: (state) => {
      state.newChecklistName = '';
    },
    setNewCheckItemName: (state, action) => {
      const { checklistId, name } = action.payload;
      state.newCheckItemNames = {
        ...state.newCheckItemNames,
        [checklistId]: name
      };
    },
    resetNewCheckItemName: (state, action) => {
      const checklistId = action.payload;
      state.newCheckItemNames = {
        ...state.newCheckItemNames,
        [checklistId]: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch checklists
      .addCase(fetchChecklists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create checklist
      .addCase(createChecklist.fulfilled, (state, action) => {
        state.items.push({ ...action.payload, checkItems: [] });
        state.newChecklistName = '';
      })
      .addCase(createChecklist.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete checklist
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        state.items = state.items.filter(list => list.id !== action.payload);
      })
      .addCase(deleteChecklist.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Create check item
      .addCase(createCheckItem.fulfilled, (state, action) => {
        const { checklistId, item } = action.payload;
        const checklist = state.items.find(list => list.id === checklistId);
        if (checklist) {
          checklist.checkItems.push(item);
        }
        state.newCheckItemNames = {
          ...state.newCheckItemNames,
          [checklistId]: ''
        };
      })
      .addCase(createCheckItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete check item
      .addCase(deleteCheckItem.fulfilled, (state, action) => {
        const { checklistId, itemId } = action.payload;
        const checklist = state.items.find(list => list.id === checklistId);
        if (checklist) {
          checklist.checkItems = checklist.checkItems.filter(item => item.id !== itemId);
        }
      })
      .addCase(deleteCheckItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Toggle check item
      .addCase(toggleCheckItem.fulfilled, (state, action) => {
        const { itemId, newState } = action.payload;
        state.items.forEach(checklist => {
          const item = checklist.checkItems.find(item => item.id === itemId);
          if (item) {
            item.state = newState;
          }
        });
      })
      .addCase(toggleCheckItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  setNewChecklistName, 
  resetNewChecklistName, 
  setNewCheckItemName, 
  resetNewCheckItemName,
  clearError 
} = checklistSlice.actions;

export default checklistSlice.reducer;