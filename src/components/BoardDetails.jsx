import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardDetails, createList, closeList, setListName } from "../store/slices/listSlice";
import { createCard, deleteCard } from "../store/slices/cardSlice";
import { toggleListForm } from "../store/slices/uiSlice";
import ListComponent from "./ListComponent";
import CreateComponent from "./CreateComponent";

const BoardDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();
    
    const { currentBoard: board, items: lists, loading, error, listName } = useSelector(state => state.lists);
    const { listFormVisible: showForm } = useSelector(state => state.ui);

    const handleCreateList = async () => {
        if (listName.trim()) {
            dispatch(createList({ boardId: params.id, listName }));
            dispatch(toggleListForm(false));
        }
    };

    const handleCreateCard = async (listId, cardName) => {
        if (cardName.trim()) {
            dispatch(createCard({ listId, cardName }));
        }
    };

    const handleDeleteCard = async (listId, cardId) => {
        dispatch(deleteCard({ listId, cardId }));
    };

    const handleCloseList = async (id) => {
        dispatch(closeList(id));
    };

    useEffect(() => {
        dispatch(fetchBoardDetails(params.id));
    }, [dispatch, params.id]);

    if (loading) {
        return <h1 className="mt-20 text-5xl text-center font-extrabold">Loading, please wait...</h1>;
    }

    if (error) {
        return <h1 className="mt-20 text-3xl text-center text-red-600 font-bold">{error}</h1>;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{board?.name}</h2>
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
                        setShowForm={(val) => dispatch(toggleListForm(val))}
                        setBoardName={(val) => dispatch(setListName(val))}
                        handleCreateBoard={handleCreateList}
                        buttonLabel="+ Add List"
                        placeholder="Enter List title"
                    />
                </div>
            </div>
        </div>
    );
};

export default BoardDetails;