import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./SearchGame.css";
const SearchGame = ({ onSearchGameHandle }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearchClick = (e) => {
    e.preventDefault();
    onSearchGameHandle(inputValue);
    setInputValue("");
  };

  return (
    <div className="searchContainer">
      <form className="search" onSubmit={handleSearchClick}>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          value={inputValue}
          placeholder="Search a game"
        />
        <button type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchGame;
