import React from "react";

function LoginForm({ AUTH_ENDPOINT, CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, SCOPE}) {
    return (
        <div className="Login">  
            <h2>Welcome to the Spotify Playlist Generator</h2>
            <h2>Login with Spotify below to continue</h2>
            <a  className="logSp" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                > Login to Spotify
            </a>
        </div>
    );
}

export default LoginForm;