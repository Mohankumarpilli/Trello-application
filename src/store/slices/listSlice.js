import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trelloApi } from '../../utils/api';

export const fetchBoardDetails = createAsyncThunk(
    'lists/fetchBoardDetails',
    async (boardId, { rejectWithValue }) => {
        try {
            const boardResponse = await trelloApi.getBoardDetails(boardId);
            const listsResponse = await trelloApi.getBoardLists(boardId);
            const listsWithCards = await Promise.all(
                listsResponse.data.map(async (list) => {
                    const cardsResponse = await trelloApi.getListCards(list.id);
                    return { ...list, cards: cardsResponse.data };
                })
            );
            return {
                board: boardResponse.data,
                lists: listsWithCards
            };
        } catch (err) {
            return rejectWithValue('Failed to fetch board details');
        }
    }
);

export const createList = createAsyncThunk(
    'lists/createList',
    async ({ boardId, listName }, { rejectWithValue }) => {
        try {
            const response = await trelloApi.createList(boardId, listName);
            return { ...response.data, cards: [] };
        } catch (err) {
            return rejectWithValue('Failed to create list');
        }
    }
);

export const closeList = createAsyncThunk(
    'lists/closeList',
    async (listId, { rejectWithValue }) => {
        try {
            await trelloApi.closeList(listId);
            return listId;
        } catch (err) {
            return rejectWithValue('Failed to close list');
        }
    }
);

const listSlice = createSlice({
    name: 'lists',
    initialState: {
        items: [],
        currentBoard: null,
        loading: false,
        error: null,
        listName: '',
    },
    reducers: {
        setListName: (state, action) => {
            state.listName = action.payload;
        },
        resetListName: (state) => {
            state.listName = '';
        },
        clearError: (state) => {
            state.error = null;
        },
        // Add a new reducer to handle card removal directly
        removeCardFromList: (state, action) => {
            const { listId, cardId } = action.payload;
            const listIndex = state.items.findIndex(list => list.id === listId);
            if (listIndex !== -1 && state.items[listIndex].cards) {
                state.items[listIndex].cards = state.items[listIndex].cards.filter(
                    card => card.id !== cardId
                );
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoardDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoardDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBoard = action.payload.board;
                state.items = action.payload.lists;
            })
            .addCase(fetchBoardDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createList.pending, (state) => {
                state.loading = true;
            })
            .addCase(createList.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.listName = '';
            })
            .addCase(createList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(closeList.fulfilled, (state, action) => {
                state.items = state.items.filter(list => list.id !== action.payload);
            })
            .addCase(closeList.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase('lists/cardAdded', (state, action) => {
                const { listId, card } = action.payload;
                const list = state.items.find(list => list.id === listId);
                if (list) {
                    if (!list.cards) list.cards = [];
                    list.cards.push(card);
                }
            })
            // Add a case for handling card deletion in the lists state
            .addCase('cards/deleteCard/fulfilled', (state, action) => {
                const { listId, cardId } = action.payload;
                const list = state.items.find(list => list.id === listId);
                if (list && list.cards) {
                    list.cards = list.cards.filter(card => card.id !== cardId);
                }
            });
    },
});

export const { setListName, resetListName, clearError, removeCardFromList } = listSlice.actions;
export default listSlice.reducer;