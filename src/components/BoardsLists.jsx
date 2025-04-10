import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBoards, createBoard, setBoardName } from "../store/slices/boardSlice";
import { toggleBoardForm } from "../store/slices/uiSlice";
import CreateComponent from "./CreateComponent";

const BoardList = () => {
    const dispatch = useDispatch();
    const { items: boards, loading, error, boardName } = useSelector(state => state.boards);
    const { boardFormVisible: showForm } = useSelector(state => state.ui);

    const handleCreateBoard = async () => {
        console.log("Board Created:", boardName);
        if (boardName.trim()) {
            dispatch(createBoard(boardName));
        }
    };

    useEffect(() => {
        dispatch(fetchBoards());
    }, [dispatch]);

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
                        setShowForm={(value) => dispatch(toggleBoardForm(value))}
                        setBoardName={(value) => dispatch(setBoardName(value))}
                        handleCreateBoard={handleCreateBoard}
                    />
                </div>
            </div>
        </div>
    );
};

export default BoardList;