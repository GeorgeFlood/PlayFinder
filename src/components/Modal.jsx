import { useEffect, useState } from "react";
import "./Modal.css";
import metacriticLogo from "../assets/imgs/Metacritic_logo.svg.png";
import Twitch from "./Twitch";
import Loader from "./Loader";

export const Modal = ({ handleModalClose, APIkey, selectedGameId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameModalInfo, setGameModalInfo] = useState("");
  const [activeTab, setActiveTab] = useState(1);

  console.log(gameModalInfo);
  useEffect(() => {
    const fetchGameforModal = async () => {
      setIsLoading(true);
      try {
        let response;
        response = await fetch(
          `https://api.rawg.io/api/games/${selectedGameId}?key=${APIkey}`
        );
        const data = await response.json();
        setGameModalInfo(data);
      } catch (error) {
        console.log(`error fetching for modal: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameforModal();
  }, [selectedGameId, APIkey]);

  const {
    name,
    description_raw: description,
    metacritic,
    background_image_additional: bgImage,
  } = gameModalInfo;

  return (
    <div className="modal">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="modal__head">
            <h1 className="modal__title">{name}</h1>
            <i
              onClick={handleModalClose}
              className="fa fa-window-close"
              aria-hidden="true"
            ></i>
          </div>

          <div className="modal__tabs">
            <button
              className={activeTab === 1 ? "active" : ""}
              onClick={() => setActiveTab(1)}
            >
              Description
            </button>
            <button
              className={activeTab === 2 ? "active" : ""}
              onClick={() => setActiveTab(2)}
            >
              Review
            </button>
            <button
              className={activeTab === 3 ? "active" : ""}
              onClick={() => setActiveTab(3)}
            >
              Streamers
            </button>
          </div>

          <div className="modal__flex">
            {activeTab === 1 && (
              <div className="modal__info">
                <img
                  className="modal__img"
                  src={bgImage}
                  alt={`image of ${name}`}
                ></img>
                <p className="modal__desc">{description}</p>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <div className="modal__meta">
                  <img
                    className="modal__meta--logo"
                    src={metacriticLogo}
                    alt="Metacritic Logo"
                  />
                  <p className="modal__meta--score">
                    {metacritic
                      ? `Metacritic score it: ${metacritic}`
                      : `Not rated on Metacritic`}
                  </p>
                </div>
                <div className="modal__userReview">
                  <h3>Played it? Rate it!</h3>
                  <p>Single Player: ⭐️⭐️⭐️⭐️⭐️</p>
                  <p>Multiplayer Player: ⭐️⭐️⭐️⭐️⭐️</p>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div>
                <Twitch gameModalInfo={gameModalInfo} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
