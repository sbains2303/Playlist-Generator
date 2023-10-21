import axios from "axios";

async function searchTracks(token, id, userID) {
  try {
    // Fetch the user's top tracks
    const topTracksResponse = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
      params: {
        time_range: "long_term"
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Extract the names of the user's top tracks
    const userTopTracks = topTracksResponse.data.items.map((track) => track.name);
    console.log("User's Top Tracks:", userTopTracks);

    // If the provided ID matches the user's ID, return their top tracks
    if (id === userID) {
      return userTopTracks;
    }

    // Fetch the top tracks of the specified artist
    const artistTopTracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
      params: {
        market: "GB"
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Extract the IDs of the artist's top tracks
    const artistTopTrackIds = artistTopTracksResponse.data.tracks.map((track) => track.id);
    console.log("Artist's Top Tracks:", artistTopTrackIds);

    // Combine the user's top tracks and the artist's top track IDs
    const allTopTracks = [...userTopTracks, ...artistTopTrackIds];

    return allTopTracks;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return []; // Return an empty array in case of an error
  }
}

export default searchTracks;
