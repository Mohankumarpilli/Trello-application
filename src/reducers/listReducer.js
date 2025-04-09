export const initiallistState = {
    board: null,
    lists: [],
    loading: true,
    error: "",
    showForm: false,
    listName: "",
};

export const listReducer = (state, action) => {
    switch (action.type) {
        case "SET_BOARD":
            return { ...state, board: action.payload, loading: false };
        case "SET_LISTS":
            return { ...state, lists: action.payload, loading: false };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        case "TOGGLE_FORM":
            return { ...state, showForm: action.payload };
        case "SET_LIST_NAME":
            return { ...state, listName: action.payload };
        case "SET_CLOSE_LIST": {
            const updatedList = state.lists.filter((ele) => ele.id !== action.payload);
            return { ...state, lists: updatedList };
        }
        case "ADD_LIST":
            return { ...state, lists: [...state.lists, action.payload] };
        case "ADD_CARD":
            return {
                ...state,
                lists: state.lists.map((list) =>
                    list.id === action.payload.listId
                        ? { ...list, cards: [...(list.cards || []), action.payload.card] }
                        : list
                ),
            };
        case "DELETE_CARD": {
            const { listId, cardId } = action.payload;
            return {
                ...state,
                lists: state.lists.map((list) =>
                    list.id === listId
                        ? {
                            ...list,
                            cards: (list.cards || []).filter((card) => card.id !== cardId),
                        }
                        : list
                ),
            };
        }
        case "SET_CARD_NAME":
            return { ...state, cardName: action.payload };
        default:
            return state;
    }
};