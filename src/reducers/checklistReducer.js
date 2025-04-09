export const initialState = {
    checklists: [],
    newCheckItemName: {}
};

// Reducer Function
export const checklistReducer = (state, action) => {
    switch (action.type) {
        case "SET_CHECKLISTS":
            return { ...state, checklists: action.payload };
        case "ADD_CHECKLIST":
            return {
                ...state,
                checklists: [...state.checklists, { ...action.payload, checkItems: [] }]
            };
        case "DELETE_CHECKLIST":
            return {
                ...state,
                checklists: state.checklists.filter(list => list.id !== action.payload)
            };
        case "ADD_CHECK_ITEM":
            return {
                ...state,
                checklists: state.checklists.map(list =>
                    list.id === action.payload.checklistId
                        ? {
                            ...list,
                            checkItems: [...list.checkItems, action.payload.item]
                        }
                        : list
                ),
                newCheckItemName: {
                    ...state.newCheckItemName,
                    [action.payload.checklistId]: ""
                }
            };
        case "DELETE_CHECK_ITEM":
            return {
                ...state,
                checklists: state.checklists.map(list =>
                    list.id === action.payload.checklistId
                        ? {
                            ...list,
                            checkItems: list.checkItems.filter(item => item.id !== action.payload.itemId)
                        }
                        : list
                )
            };
        case "TOGGLE_CHECK_ITEM":
            return {
                ...state,
                checklists: state.checklists.map(list =>
                    list.id === action.payload.checklistId
                        ? {
                            ...list,
                            checkItems: list.checkItems.map(item =>
                                item.id === action.payload.itemId
                                    ? { ...item, state: action.payload.newState }
                                    : item
                            )
                        }
                        : list
                )
            };
        case "SET_NEW_CHECKITEM_NAME":
            return {
                ...state,
                newCheckItemName: {
                    ...state.newCheckItemName,
                    [action.payload.checklistId]: action.payload.name
                }
            };
        default:
            return state;
    }
};