import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, Typography } from "@mui/material";
import { setCardName, setSelectedCard, deleteCard } from "../store/slices/cardSlice";
import { toggleCardForm, toggleCardDialog } from "../store/slices/uiSlice";
import CreateComponent from "./CreateComponent";
import CardDetailsDialog from "./CardDetailsDialog";

const ListComponent = ({ list, handleCreateCard, handleCloseList }) => {
    const dispatch = useDispatch();
    const { cardName } = useSelector(state => state.cards);
    const { selectedCard } = useSelector(state => state.cards);
    const { cardFormVisibleMap, cardDialogOpen } = useSelector(state => state.ui);

    const showForm = cardFormVisibleMap[list.id] || false;

    const handleSubmit = () => {
        handleCreateCard(list.id, cardName);
        dispatch(setCardName(''));
        dispatch(toggleCardForm({ listId: list.id, isVisible: false }));
    };

    const handleOpenDialog = (card) => {
        dispatch(setSelectedCard(card));
        dispatch(toggleCardDialog(true));
    };

    const handleCloseDialog = () => {
        dispatch(toggleCardDialog(false));
        dispatch(setSelectedCard(null));
    };

    const handleDeleteCard = (listId, cardId) => {
        // Use the deleteCard thunk directly from here
        dispatch(deleteCard({ listId, cardId }));

        // If the card being deleted is currently selected, close the dialog
        if (selectedCard && selectedCard.id === cardId) {
            handleCloseDialog();
        }
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
                        onClick={() => handleOpenDialog(card)}
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
                showForm={showForm}
                boardName={cardName}
                setShowForm={(visible) => dispatch(toggleCardForm({ listId: list.id, isVisible: visible }))}
                setBoardName={(value) => dispatch(setCardName(value))}
                handleCreateBoard={handleSubmit}
                buttonLabel="+ Add Card"
                placeholder="Enter card title"
            />

            {/* We'll only show one dialog at a time, controlled by the Redux state */}
            {cardDialogOpen && selectedCard && list.cards?.some(card => card.id === selectedCard.id) && (
                <CardDetailsDialog
                    open={cardDialogOpen}
                    onClose={handleCloseDialog}
                    card={selectedCard}
                />
            )}
        </div>
    );
};

export default ListComponent;