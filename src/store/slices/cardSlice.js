import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trelloApi } from '../../utils/api';

export const createCard = createAsyncThunk(
    'cards/createCard',
    async ({ listId, cardName }, { rejectWithValue, dispatch }) => {
        try {
            const response = await trelloApi.createCard(listId, cardName);
            if (!response.data || !response.data.id) {
                throw new Error('Card creation failed or response invalid');
            }
            dispatch({ type: 'lists/cardAdded', payload: { listId, card: response.data } });
            return { listId, card: response.data };
        } catch (err) {
            return rejectWithValue('Failed to create card');
        }
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async ({ listId, cardId }, { rejectWithValue, dispatch }) => {
        try {
            await trelloApi.deleteCard(cardId);

            // Explicitly update the lists slice when a card is deleted
            dispatch({
                type: 'lists/removeCardFromList',
                payload: { listId, cardId }
            });

            return { listId, cardId };
        } catch (err) {
            return rejectWithValue('Failed to delete card');
        }
    }
);

const cardSlice = createSlice({
    name: 'cards',
    initialState: {
        selectedCard: null,
        cardName: '',
        error: null,
        cardsByList: {}
    },
    reducers: {
        setSelectedCard: (state, action) => {
            state.selectedCard = action.payload;
        },
        clearSelectedCard: (state) => {
            state.selectedCard = null;
        },
        setCardName: (state, action) => {
            state.cardName = action.payload;
        },
        resetCardName: (state) => {
            state.cardName = '';
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCard.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCard.fulfilled, (state, action) => {
                const { listId, cardId } = action.payload;

                // Clean up the cardsByList state
                if (state.cardsByList[listId]) {
                    state.cardsByList[listId] = state.cardsByList[listId].filter(
                        (card) => card.id !== cardId
                    );
                }

                // If the deleted card is the currently selected card, clear it
                if (state.selectedCard && state.selectedCard.id === cardId) {
                    state.selectedCard = null;
                }

                state.error = null;
            })
            .addCase(deleteCard.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const {
    setSelectedCard,
    clearSelectedCard,
    setCardName,
    resetCardName,
    clearError
} = cardSlice.actions;

export default cardSlice.reducer;