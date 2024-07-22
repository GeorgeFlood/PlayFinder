import React from "react";
import "./DisplayedGame.css";

const DisplayedGame = ({ gameData, searchedGame, APIkey, handleModalOpen }) => {
  if (!gameData || !gameData.results) {
    console.log("gameData is not available or does not contain results");
    return <div>No game data available</div>;
  }

  // Destructure and sort the results array by release date in descending order
  const { results } = gameData;

  const sortedResults = [...results].sort((a, b) => {
    const dateA = a.released ? new Date(a.released) : new Date(0);
    const dateB = b.released ? new Date(b.released) : new Date(0);
    return dateB - dateA; // Change the order to descending
  });

  // Limit the number of results to 18

  const filterMetacritic = sortedResults.filter((game) => {
    return game.metacritic !== null && game.metacritic !== undefined;
  });

  // Split the results into rows of 6 cards each
  const rows = [];
  for (let i = 0; i < filterMetacritic.length; i += 6) {
    rows.push(filterMetacritic.slice(i, i + 4));
  }

  return (
    <div className="gameCard__container">
      <h1>
        {searchedGame ? `Results from ${searchedGame}` : "Trending games"}
      </h1>

      {rows.map((row, rowIndex) => (
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
      ))}
    </div>
  );
};

export default DisplayedGame;
