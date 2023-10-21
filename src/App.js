import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import GenreSearch from "./components/GenreSearch";
import ArtistSearch from "./components/ArtistSearch";
import createPlaylist from "./components/MakePlaylist";

const CLIENT_ID = "71a21cb54fc34717ac2121989e0b733d";
const CLIENT_SECRET = "e36d9c218de74fd387d2885fae71b438";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPE =
  "user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private";

export const getSongsByArtist = async (id, token, genres,tracks, userId) => {
    try {
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                seed_artists: id,
                seed_tracks: tracks,
                seed_genres: genres,
                limit: 30,
            }
    });
    console.log(data);
    let trackIds = [];
    data.tracks.forEach(track => {
        trackIds.push(track.uri);
    });
    console.log(trackIds);
    const htmlElement = createPlaylist(tracks=trackIds,id=userId,token=token);
    return htmlElement;
    } catch (error) {
        console.error('Error fetching genres by artist:',error);
    }
};

function App() {

    const [token, setToken] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);
    const [userID, setID] = useState("");

    let artist = ''

    useEffect(() => {
        document.body.style.backgroundColor = "#191414";
    }, []);

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");
        let expiresIn = window.localStorage.getItem("expiresIn");

        if (!token && hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            token = hashParams.get("access_token");
            expiresIn = hashParams.get("expires_in");

            const expirationTime = new Date().getTime() + expiresIn * 1000;
           
            window.location.hash = "";
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("expiresIn", expirationTime.toString());
        }
        setToken(token);
        setExpiresIn(expiresIn);

        if (expiresIn && expiresIn < new Date().getTime()) {
            refreshToken();
        }

          // Fetch user information including scopes
        if (token) {
            axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
        },
            })
            .then(response => {
            // Extract scopes from the response
            const userScopes = response.data.scope;
            console.log('Response:', response.data.id);
            setID(response.data.id);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, []);
      
    const refreshToken = () => {
        const refreshToken = window.localStorage.getItem("refreshToken");
        if (!refreshToken) {
            return;
        }

        axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
                },
            })
    .then((response) => {
            const newAccessToken = response.data.access_token;
            const newExpiresIn = response.data.expires_in;

            setToken(newAccessToken);
            setExpiresIn(new Date().getTime() + newExpiresIn * 1000);

            window.localStorage.setItem("token", newAccessToken);
            window.localStorage.setItem("expiresIn", expiresIn.toString());
        })
        .catch((error) => {
            console.error("Token refresh error:", error);
        });
        console.log(refreshToken);
    };

    const logout = () => {
        setToken("");
        setExpiresIn(0);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("expiresIn");
    };
    console.log(expiresIn);


    return (
        <div className="App">
  <Header />
  <div className="main-content">
    <div className="content">
      {!token ? (
        <LoginForm
          AUTH_ENDPOINT={AUTH_ENDPOINT}
          CLIENT_ID={CLIENT_ID}
          REDIRECT_URI={REDIRECT_URI}
          RESPONSE_TYPE={RESPONSE_TYPE}
          SCOPE={SCOPE}
        />
      ) : (
        <div>
          {token ? (
            <div>
              <h2 className="intro">
                Generate playlist according to one of the following
              </h2>
              <ArtistSearch
                token={token}
                artist={artist}
                userID={userID}
                getSongsByArtist={(id) => getSongsByArtist(id, token)}
              />
              <GenreSearch token={token} userID={userID} />
            </div>
          ) : (
            <h2>Please login</h2>
          )}
        </div>
      )}
    </div>

    {token && (
      <footer>
        <button className="Logout-Button" onClick={logout}>
          Logout
        </button>
      </footer>
    )}
  </div>
</div>
    );
}

export default App;
