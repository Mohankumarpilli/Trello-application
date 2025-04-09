import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center m-10">
      <h1 className="font-extrabold text-5xl color-black m-20">
        Welcome to Trello WebSite
      </h1>
      <Link to={"/Boards"}>
        <Button variant="outlined">Boards</Button>
      </Link>
    </div>
  );
};
export default Home;
