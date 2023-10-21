import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSongsByArtist } from "../App";
import searchTracks from "./TopTracks.js";

function ArtistSearch({ token, artist, userID }) {
    const [searchKey, setSearchKey] = useState("");
    const [iframeHtml, setIframeHtml] = useState(null);

    const searchArtists = async (e) => {
        e.preventDefault();

        // Create an AudioContext
        const audioContext = new AudioContext();

        // Search for artists using the Spotify API
        const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: searchKey,
                type: "artist"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Get the first artist in the search results
        artist = data.artists.items[0];
        console.log(artist.id);

        // Search for the top tracks of the artist
        let tracks = await searchTracks(token, artist.id, userID);
        console.log(tracks);

        // Get the HTML element of the playlist generated from the artist
        const htmlElement = await getSongsByArtist(artist.id, token, artist.genres, tracks, userID);
        setIframeHtml(htmlElement);
    }

    const checkTokenValidity = async (token) => {
        try {
            // Check if the token is valid by making a request to the Spotify API
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
            <h1 className="Artist-Head">Artist</h1>
            <p className="description">Enter an artist to get suggested songs</p>
            <form className="Input-Form" onSubmit={searchArtists}>
                <input className="Input-Box" type="text" placeholder="Artist" onChange={e => setSearchKey(e.target.value)} />
                <button className="Input-Button" type={"submit"}>Generate</button>
            </form>
            {iframeHtml && <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />}
        </div>
    );
}

export default ArtistSearch;
