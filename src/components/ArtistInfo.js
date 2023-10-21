import React from "react";

function ArtistInfo({ artist }) {
    return (
        <div key={artist.id}>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            {artist.name}
        </div>
    );
}

export default ArtistInfo;