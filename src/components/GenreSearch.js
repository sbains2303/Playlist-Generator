import React, { useState, useEffect } from "react";
import axios from "axios";
import { getSongsByArtist } from "../App";
import searchTracks from "./TopTracks.js";
import createPlaylist from "./MakePlaylist";

function GenreSearch({ token, userID }) {
    const [searchKey, setSearchKey] = useState("");
    const [iframeHtml, setIframeHtml] = useState(null);
    const [genres, setGenres] = useState([]); // State to store genres
    const [selectedGenre, setSelectedGenre] = useState(""); // State to store the selected genre

    // Fetch and set available genres when the component mounts
    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        }

        // Call the fetchGenres function when the component mounts or when the token changes
        fetchGenres();
    }, [token]);

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value); // Update the selected genre in state
    };

    const searchSongs = async (e) => {
        e.preventDefault();

        const audioContext = new AudioContext();
        const tracks = await searchTracks(token, userID, userID);
        console.log(tracks);
        console.log(selectedGenre);

        // Search for recommendations based on selected genre and tracks
        const { data } = await axios.get(`https://api.spotify.com/v1/recommendations`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                seed_tracks: tracks,
                seed_genres: selectedGenre,
                limit: 30
            }
        });
        console.log(data);
        let trackIds = [];
        data.tracks.forEach(track => {
            trackIds.push(track.uri);
        });

        // Create a playlist with the recommended track IDs
        createPlaylist(trackIds, userID, token);
    }

    const checkTokenValidity = async (token) => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
            // Log the result
            // console.log('Token is valid: ', response.data);
            return true;
        } catch (error) {
            // Log if the token is invalid
            console.error('Token is invalid:', error);
            return false;
        }
    };
    // Check the token's validity when the component is mounted
    checkTokenValidity(token);

    return (
        <div>
            <hr className="Divider"></hr>
            <h1 className="Artist-Head">Genre</h1>
            <p className="description2">Enter a genre to get suggested songs</p>
            <form className="Input-Form2" onSubmit={searchSongs}>
                <select className="Input-Box2" onChange={handleGenreChange}>
                    <option value="">Select a Genre</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                <button className="Input-Button2" type="submit">
                    Generate
                </button>
            </form>
            {iframeHtml && <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />}
        </div>
    );
}

export default GenreSearch;
