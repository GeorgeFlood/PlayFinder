import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchGame from "./components/SearchGame";
import DisplayedGame from "./components/DisplayedGame";
import Modal from "./components/Modal";
import Recommended from "./components/Recommended";
import Loader from "./components/Loader";

const APIkey = "7a0961d2542d4975aa8bff2ef74acc2d";
const today = new Date().toISOString().split("T")[0];

function App() {
  const [searchedGame, setSearchedGame] = useState("");
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);

  useEffect(() => {
    const getSearchedGameData = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0]; // Ensure today's date is always current
      try {
        let response;
        if (!searchedGame) {
          response = await fetch(
            `https://api.rawg.io/api/games?key=${APIkey}&dates=${today}&ordering=-added`
          );
        } else {
          response = await fetch(
            `https://api.rawg.io/api/games?key=${APIkey}&search=${searchedGame}`
          );
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the API response
        setGameData(data);
      } catch (error) {
        console.log(`Error fetching games: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    getSearchedGameData();
  }, [searchedGame]);

  const onSearchGameHandle = (query) => {
    setSearchedGame(query);
  };

  const handleModalOpen = (gameID) => {
    setSelectedGameId(gameID);
    setModelOpen(true);
  };

  const handleModalClose = () => {
    setSelectedGameId(null);
    setModelOpen(false);
  };

  return (
    <>
      <Header />
      <SearchGame onSearchGameHandle={onSearchGameHandle} />

      {isLoading ? (
        <Loader />
      ) : (
        <DisplayedGame
          gameData={gameData}
          searchedGame={searchedGame}
          handleModalOpen={handleModalOpen}
        />
      )}
      {searchedGame && (
        <Recommended
          gameData={gameData}
          APIkey={APIkey}
          handleModalOpen={handleModalOpen}
        />
      )}
      {modelOpen && gameData && (
        <Modal
          handleModalClose={handleModalClose}
          APIkey={APIkey}
          selectedGameId={selectedGameId}
        />
      )}
    </>
  );
}

export default App;
