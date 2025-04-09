import React, { useReducer } from "react";
import CreateComponent from "./CreateComponent";
import { Card, CardContent, Typography } from "@mui/material";
import CardDetailsDialog from "./CardDetailsDialog";
import { cardListreducer, initialState } from "../reducers/cardListReducer";

const ListComponent = ({ list, handleCreateCard, handleCloseList, handleDeleteCard }) => {
    const [state, dispatch] = useReducer(cardListreducer, initialState);

    const handleSubmit = () => {
        handleCreateCard(list.id, state.cardName);
        dispatch({ type: "RESET_FORM" });
    };

    return (
        <div className="w-80 min-w-[250px] bg-gray-200 rounded-lg shadow-md p-4 flex flex-col gap-4">
            <div className="flex justify-between">
                <Typography variant="h6" className="font-bold text-blue-700 flex justify-between items-center">
                    {list.name}
                    <button
                        className="ml-2 text-red-500 font-bold"
                        onClick={() => handleCloseList(list.id)}
                    >
                        ✕
                    </button>
                </Typography>
            </div>

            <div className="flex flex-col gap-2">
                {list.cards?.map((card) => (
                    <Card
                        variant="outlined"
                        key={card.id}
                        onClick={() => dispatch({ type: "OPEN_DIALOG", payload: card })}
                        className="cursor-pointer"
                    >
                        <CardContent className="flex justify-between items-center">
                            <Typography>{card.name}</Typography>
                            <button
                                className="ml-2 text-red-500 font-bold"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent card dialog from opening
                                    handleDeleteCard(list.id, card.id);
                                }}
                            >
                                ✕
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CreateComponent
                showForm={state.showForm}
                boardName={state.cardName}
                setShowForm={() => dispatch({ type: "TOGGLE_FORM" })}
                setBoardName={(val) => dispatch({ type: "SET_CARD_NAME", payload: val })}
                handleCreateBoard={handleSubmit}
                buttonLabel="+ Add Card"
                placeholder="Enter card title"
            />

            {/* Card Details Dialog */}
            <CardDetailsDialog
                open={state.openDialog}
                onClose={() => dispatch({ type: "CLOSE_DIALOG" })}
                card={state.selectedCard}
            />
        </div>
    );
};

export default ListComponent;
