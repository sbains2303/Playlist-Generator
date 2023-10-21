import axios from "axios";

async function createPlaylist(tracks, id, token) {
  // Create playlist data with name and privacy settings
  let playlistData = {
    name: 'Generate Playlist',
    public: false,
  };

  try {
    // Create a new playlist for the user
    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, playlistData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    // Extract the playlist ID from the response
    const playlistID = playlistResponse.data.id;

    // Add tracks to the newly created playlist
    const addTracksResponse = await axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, tracks, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log("Tracks added to the playlist:", addTracksResponse);

    // Generate an HTML element for the embedded Spotify playlist
    const playlistElement = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistID}" width="50%" height="400" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    
    return playlistElement;
  } catch (error) {
    console.error('Error creating playlist or adding tracks:', error);
  }
}

export default createPlaylist;

