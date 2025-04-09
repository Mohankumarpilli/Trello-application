export const initialBoardState = {
    boards: [],
    loading: true,
    error: "",
    showForm: false,
    boardName: "",
  };
  
  export const boardReducer = (state, action) => {
    switch (action.type) {
      case "SET_BOARDS":
        return { ...state, boards: action.payload, loading: false };
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload, loading: false };
      case "TOGGLE_FORM":
        return { ...state, showForm: action.payload };
      case "SET_BOARD_NAME":
        return { ...state, boardName: action.payload };
      case "ADD_BOARD":
        return { ...state, boards: [...state.boards, action.payload] };
      default:
        return state;
    }
  };
