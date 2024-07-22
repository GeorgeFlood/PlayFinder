import React, { useEffect, useState } from "react";
import "./Twitch.css";
import Loader from "./Loader";

export const Twitch = ({ gameModalInfo }) => {
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const client_ID = "cy7vmsezo4dkpvwlw8sec75muslvkq";
  const client_Secret = "khft4uob2wdm468rmjtforf3pzhogm";

  useEffect(() => {
    if (!gameModalInfo) return;

    const fetchStreamers = async () => {
      setIsLoading(true);
      try {
        const accessToken = await getAccessToken(client_ID, client_Secret);

        const response = await fetch(
          `https://api.twitch.tv/helix/games?name=${gameModalInfo.name}`,
          {
            headers: {
              "Client-ID": client_ID,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const gameData = await response.json();
        const gameId = gameData.data[0].id;

        const streamerResponse = await fetch(
          `https://api.twitch.tv/helix/streams?game_id=${gameId}`,
          {
            headers: {
              "Client-ID": client_ID,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const streamerData = await streamerResponse.json();
        setStreamers(streamerData.data);
      } catch (error) {
        console.log(`There was an error fetching streamers: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamers();
  }, [gameModalInfo]);

  console.log(`From twitch: ${JSON.stringify(gameModalInfo)}`);

  const streamerTop3 = streamers.slice(0, 3);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {streamerTop3.length > 0 && (
            <h3>
              {streamerTop3.length < 2
                ? `Only Streamer on twitch for ${gameModalInfo.name}`
                : `Top ${streamerTop3.length} streams on twitch for '${gameModalInfo.name}'`}
            </h3>
          )}

          {streamers.length > 0 ? (
            <ul className="streamers">
              {streamerTop3.map((streamer) => (
                <li key={streamer.id} className="streamer__item">
                  <a
                    href={`https://www.twitch.tv/${streamer.user_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="live-banner">LIVE</div>
                    <img
                      className="streamer__img"
                      src={streamer.thumbnail_url
                        .replace("{width}", "320")
                        .replace("{height}", "180")}
                      alt={`Thumbnail of ${streamer.user_name}`}
                    />
                    <div className="streamer__info">
                      {streamer.user_name} - {streamer.viewer_count} viewers
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No streamers currently streaming this game.</p>
          )}
        </div>
      )}
    </div>
  );
};

async function getAccessToken(clientId, clientSecret) {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  return data.access_token;
}

export default Twitch;
