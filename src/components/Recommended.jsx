import React, { useState, useEffect } from "react";
import "./DisplayedGame.css";
import Loader from "./Loader";

const Recommended = ({ gameData, APIkey, handleModalOpen }) => {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!gameData || !gameData.results || !gameData.results.length) {
        console.error("Invalid gameData:", gameData);
        return null;
      }
      return gameData.results[0];
    };

    const fetchRecommendedGames = async (genreId, platformId) => {
      if (!genreId || !platformId) {
        console.error("Invalid genreId or platformId:", genreId, platformId);
        return;
      }

      const response = await fetch(
        `https://api.rawg.io/api/games?key=${APIkey}&genres=${genreId}&parent_platforms=${platformId}&metacritic=75,100&page_size=10`
      );
      const data = await response.json();
      setRecommendedGames(data.results || []);
    };

    const getRecommendedGames = async () => {
      setIsLoading(true);
      try {
        const gameDetails = await fetchGameDetails();
        if (gameDetails) {
          const genreId = gameDetails.genres[0]?.id;
          const platformId = gameDetails.parent_platforms[0]?.platform?.id;
          if (genreId && platformId) {
            await fetchRecommendedGames(genreId, platformId);
          }
        }
      } catch (error) {
        console.log(`Error from recommended game search: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameData && gameData.results && gameData.results.length > 0) {
      getRecommendedGames();
    }
  }, [gameData, APIkey]);

  if (!gameData || !gameData.results || gameData.results.length === 0) {
    return null; // or return an empty fragment: <></>
  }

  // Split the recommended games into rows of 4 cards each
  const rows = [];
  for (let i = 0; i < recommendedGames.length; i += 4) {
    rows.push(recommendedGames.slice(i, i + 4));
  }

  return (
    <div className="gameCard__container">
      <h2>Recommended Games</h2>
      {isLoading ? (
        <Loader />
      ) : (
        rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row-container">
            {row.map((game) => (
              <div key={game.id} className="card-wrapper">
                <div className="gameCard">
                  <h3 className="gameCard__name">{game.name}</h3>
                  <p className="gameCard__release">Released: {game.released}</p>
                  <p className="gameCard__platform">
                    Platforms:{" "}
                    {game.platforms
                      .map((platform) => platform.platform.name)
                      .join(", ")}
                  </p>
                  <img
                    className="gameCard__img"
                    src={game.background_image}
                    alt={game.name}
                    width="200"
                  />
                  <button onClick={() => handleModalOpen(game.id)}>
                    View more
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Recommended;
