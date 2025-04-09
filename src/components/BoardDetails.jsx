import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { initiallistState, listReducer } from "../reducers/listReducer";
import { trelloApi } from "../utils/api";
import ListComponent from "./ListComponent";
import CreateComponent from "./CreateComponent";

const BoarDetails = () => {
    const params = useParams();
    const [state, dispatch] = useReducer(listReducer, initiallistState);
    const { board, lists, loading, error, showForm, listName, cardName } = state;

    const fetchList = async () => {
        try {
            const boardResponse = await trelloApi.getBoardDetails(params.id);
            const listsResponse = await trelloApi.getBoardLists(params.id);

            const listsWithCards = await Promise.all(
                listsResponse.data.map(async (list) => {
                    const cardsResponse = await trelloApi.getListCards(list.id);
                    return { ...list, cards: cardsResponse.data };
                })
            );
            dispatch({ type: "SET_BOARD", payload: boardResponse.data });
            dispatch({ type: "SET_LISTS", payload: listsWithCards });
        } catch (err) {
            console.error("Failed to fetch boards:", err);
            dispatch({ type: "SET_ERROR", payload: "Failed to fetch boards" });
        }
    };

    const handleCreateList = async () => {
        try {
            const response = await trelloApi.createList(params.id, listName);
            dispatch({ type: "ADD_LIST", payload: { ...response.data, cards: [] } });
            dispatch({ type: "SET_LIST_NAME", payload: "" });
            dispatch({ type: "TOGGLE_FORM", payload: false });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: "Failed to create list" });
        }
    };

    const handleCreateCard = async (listId, cardName) => {
        try {
            const response = await trelloApi.createCard(listId, cardName);
            dispatch({ type: "ADD_CARD", payload: { listId, card: response.data } });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: "Failed to create card" });
        }
    };

    const handleDeleteCard = async (listId, cardId) => {
        try {
            dispatch({ type: "DELETE_CARD", payload: { listId, cardId } });
            const response = await trelloApi.deleteCard(cardId);
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to create card" });
        }
    }

    const handleCloseList = async (id) => {
        try {
            await trelloApi.closeList(id); // assuming this closes it on backend
            dispatch({ type: "SET_CLOSE_LIST", payload: id }); // ✅ fixed
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: "Failed to close list" });
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return <h1 className="mt-20 text-5xl text-center font-extrabold">Loading, please wait...</h1>;
    }

    if (error) {
        return <h1 className="mt-20 text-3xl text-center text-red-600 font-bold">{error}</h1>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{board.name}</h2>
            <div className="flex gap-6 overflow-x-auto flex-nowrap">
                {lists.map((list) => (
                    <ListComponent
                        key={list.id}
                        list={list}
                        handleCreateCard={handleCreateCard}
                        handleCloseList={handleCloseList}
                        handleDeleteCard={handleDeleteCard}
                    />
                ))}

                {/* CreateComponent for adding a new list */}
                <div className="w-80 min-w-[250px] bg-gray-200 rounded-lg shadow-md p-4 flex flex-col gap-4">
                    <CreateComponent
                        showForm={showForm}
                        boardName={listName}
                        setShowForm={(val) => dispatch({ type: "TOGGLE_FORM", payload: val })}
                        setBoardName={(val) => dispatch({ type: "SET_LIST_NAME", payload: val })}
                        handleCreateBoard={handleCreateList}
                        buttonLabel="+ Add List"
                        placeholder="Enter List title"
                    />
                </div>
            </div>
        </div>
    );
};
export default BoarDetails;