// BoardList.jsx

import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { trelloApi } from "../utils/api";
import CreateComponent from "./CreateComponent";
import { boardReducer, initialBoardState } from "../reducers/boardReducer";

const BoardList = () => {
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);
    const { boards, loading, error, showForm, boardName } = state;

    const handleCreateBoard = async () => {
        console.log("Board Created:", boardName);
        try {
            const response = await trelloApi.postBoard(boardName);
            const newBoard = response.data;
            dispatch({ type: "ADD_BOARD", payload: newBoard });
            dispatch({ type: "SET_BOARD_NAME", payload: "" });
            dispatch({ type: "TOGGLE_FORM", payload: false });
        } catch (err) {
            console.error("Failed to create board:", err);
            dispatch({ type: "SET_ERROR", payload: "Failed to create board" });
        }
    };

    const fetchBoards = async () => {
        try {
            const boardsResponse = await trelloApi.getBoardsDetails();
            dispatch({ type: "SET_BOARDS", payload: boardsResponse.data });
        } catch (err) {
            console.error("Failed to fetch boards:", err);
            dispatch({ type: "SET_ERROR", payload: "Failed to fetch boards" });
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    if (loading) {
        return <h1 className="mt-20 text-5xl text-center font-extrabold">Loading, please wait...</h1>;
    }

    if (error) {
        return <h1 className="mt-20 text-3xl text-center text-red-600 font-bold">{error}</h1>;
    }

    return (
        <div className="flex flex-col px-70 justify-center">
            <h1 className="text-3xl font-bold text-center m-10 pr-10">Board Lists</h1>
            <div className="grid grid-cols-4 gap-3">
                {boards.map((board) => {
                    const color = board.prefs.backgroundColor;
                    const img = board.prefs.backgroundImage;
                    const style = color
                        ? { backgroundColor: color, backgroundSize: "cover" }
                        : {
                            backgroundImage: `url(${img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        };
                    return (
                        <Link to={`/Board/${board.id}`} key={board.id}>
                            <div
                                style={style}
                                className="h-40 rounded-xl p-2 text-xl font-extrabold shadow-lg"
                            >
                                {board.name}
                            </div>
                        </Link>
                    );
                })}
                <div>
                    <CreateComponent
                        showForm={showForm}
                        boardName={boardName}
                        setShowForm={(value) => dispatch({ type: "TOGGLE_FORM", payload: value })}
                        setBoardName={(value) => dispatch({ type: "SET_BOARD_NAME", payload: value })}
                        handleCreateBoard={handleCreateBoard}
                    />
                </div>
            </div>
        </div>
    );
};

export default BoardList;
