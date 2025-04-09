import React, { useEffect, useReducer, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from "@mui/material";
import { trelloApi } from "../utils/api";
import { checklistReducer, initialState } from "../reducers/checklistReducer";

const CardDetailsDialog = ({ open, onClose, card }) => {
    const [newChecklistName, setNewChecklistName] = useState("");
    const [state, dispatch] = useReducer(checklistReducer, initialState);

    const fetchChecklists = async () => {
        if (!card) return;
        try {
            const response = await trelloApi.getCardChecklists(card.id);
            dispatch({ type: "SET_CHECKLISTS", payload: response.data });
        } catch (err) {
            console.error("Checklist error", err);
        }
    };

    const handleAddChecklist = async () => {
        if (!newChecklistName.trim()) return;
        try {
            const response = await trelloApi.createChecklist(card.id, newChecklistName);
            dispatch({ type: "ADD_CHECKLIST", payload: response.data });
            setNewChecklistName("");
        } catch (err) {
            console.error("Failed to add checklist", err);
        }
    };

    const handleDeleteCheckList = async (checklistId) => {
        try {
            dispatch({ type: "DELETE_CHECKLIST", payload: checklistId });
            await trelloApi.deleteChecklist(checklistId);
        } catch (err) {
            console.error("Failed to delete checklist", err);
        }
    };

    const handleAddCheckItem = async (checklistId) => {
        const name = state.newCheckItemName[checklistId]?.trim();
        if (!name) return;
        try {
            const response = await trelloApi.createCheckItem(checklistId, name);
            dispatch({
                type: "ADD_CHECK_ITEM",
                payload: { checklistId, item: response.data }
            });
        } catch (err) {
            console.error("Failed to add check item", err);
        }
    };

    const handleDeleteCheckItem = async (checklistId, itemId) => {
        try {
            dispatch({
                type: "DELETE_CHECK_ITEM",
                payload: { checklistId, itemId }
            });
            await trelloApi.deleteCheckItem(checklistId, itemId);
        } catch (err) {
            console.error("Failed to delete check item", err);
        }
    };

    const handleToggleCheckItem = async (cardId, itemId) => {
        try {
            const checklist = state.checklists.find(cl => cl.checkItems.some(it => it.id === itemId));
            if (!checklist) return;

            const item = checklist.checkItems.find(it => it.id === itemId);
            const newState = item.state === "complete" ? "incomplete" : "complete";

            dispatch({
                type: "TOGGLE_CHECK_ITEM",
                payload: { checklistId: checklist.id, itemId, newState }
            });
            await trelloApi.updateCheckItem(cardId, itemId, newState);
        } catch (err) {
            console.error("Failed to toggle check item state", err);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, [card]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{card?.name}</DialogTitle>
            <DialogContent dividers>
                {state.checklists.length ? (
                    state.checklists.map((list) => (
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
                                            value={state.newCheckItemName[list.id] || ""}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_NEW_CHECKITEM_NAME",
                                                    payload: { checklistId: list.id, name: e.target.value }
                                                })
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
                        onChange={(e) => setNewChecklistName(e.target.value)}
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
