export const initialState = {
    showForm: false,
    cardName: "",
    openDialog: false,
    selectedCard: null,
};

export const cardListreducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_FORM":
            return { ...state, showForm: !state.showForm };
        case "SET_CARD_NAME":
            return { ...state, cardName: action.payload };
        case "OPEN_DIALOG":
            return { ...state, openDialog: true, selectedCard: action.payload };
        case "CLOSE_DIALOG":
            return { ...state, openDialog: false, selectedCard: null };
        case "RESET_FORM":
            return { ...state, cardName: "", showForm: false };
        default:
            return state;
    }
};