import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from "@mui/material";
import { 
    fetchChecklists, 
    createChecklist, 
    deleteChecklist, 
    createCheckItem, 
    deleteCheckItem, 
    toggleCheckItem,
    setNewChecklistName,
    resetNewChecklistName,
    setNewCheckItemName
} from "../store/slices/checklistSlice";

const CardDetailsDialog = ({ open, onClose, card }) => {
    const dispatch = useDispatch();
    const { items: checklists, newChecklistName, newCheckItemNames } = useSelector(state => state.checklists);

    const fetchCardChecklists = () => {
        if (card && card.id) {
            dispatch(fetchChecklists(card.id));
        }
    };

    const handleAddChecklist = async () => {
        if (!newChecklistName.trim()) return;
        dispatch(createChecklist({ cardId: card.id, name: newChecklistName }));
    };

    const handleDeleteCheckList = async (checklistId) => {
        dispatch(deleteChecklist(checklistId));
    };

    const handleAddCheckItem = async (checklistId) => {
        const name = newCheckItemNames[checklistId]?.trim();
        if (!name) return;
        dispatch(createCheckItem({ checklistId, name }));
    };

    const handleDeleteCheckItem = async (checklistId, itemId) => {
        dispatch(deleteCheckItem({ checklistId, itemId }));
    };

    const handleToggleCheckItem = async (cardId, itemId) => {
        const checklist = checklists.find(cl => cl.checkItems.some(it => it.id === itemId));
        if (!checklist) return;

        const item = checklist.checkItems.find(it => it.id === itemId);
        dispatch(toggleCheckItem({ 
            cardId, 
            itemId, 
            currentState: item.state 
        }));
    };

    useEffect(() => {
        fetchCardChecklists();
    }, [card]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{card?.name}</DialogTitle>
            <DialogContent dividers>
                {checklists.length ? (
                    checklists.map((list) => (
                        <div
                            key={list.id}
                            className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                        >
                            <Typography variant="subtitle1" className="text-lg font-semibold text-blue-700 mb-2">
                                <div className="flex justify-between">
                                    <span>{list.name}</span>
                                    <button className="ml-2 text-red-500 font-bold" onClick={() => handleDeleteCheckList(list.id)}>✕</button>
                                </div>
                            </Typography>
                            <ul className="ml-5">
                                {list.checkItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-1 pl-2 border-l-4 border-blue-500 bg-white rounded hover:bg-blue-50 transition"
                                    >
                                        <Typography className="text-gray-800 flex justify-between">
                                            <input
                                                type="checkbox"
                                                checked={item.state === "complete"}
                                                onChange={() => handleToggleCheckItem(card.id, item.id)}
                                            />
                                            <span>{item.name}</span>
                                            <button className="ml-2 text-red-500 font-bold" onClick={() => handleDeleteCheckItem(list.id, item.id)}>✕</button>
                                        </Typography>
                                    </li>
                                ))}
                                <li className="py-1 pl-2 border-l-4 border-blue-500 bg-white rounded hover:bg-blue-50 transition">
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="New item name"
                                            className="border p-1 rounded flex-1"
                                            value={newCheckItemNames[list.id] || ""}
                                            onChange={(e) =>
                                                dispatch(setNewCheckItemName({ 
                                                    checklistId: list.id, 
                                                    name: e.target.value 
                                                }))
                                            }
                                        />
                                        <Button onClick={() => handleAddCheckItem(list.id)} size="small" variant="outlined">
                                            Add
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))
                ) : (
                    <Typography className="text-gray-600 italic">No checklists found.</Typography>
                )}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="New checklist name"
                        className="border p-2 rounded w-full mb-2"
                        value={newChecklistName}
                        onChange={(e) => dispatch(setNewChecklistName(e.target.value))}
                    />
                    <Button onClick={handleAddChecklist} variant="contained" size="small">
                        Add Checklist
                    </Button>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CardDetailsDialog;