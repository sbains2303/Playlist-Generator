import React from "react";
import logo from './spotify-logo.png';

function Header() {

    return (
        <header className="header">
            <img src={logo} alt="Logo" />
            <h1 id="target">Spotify Playlist Generator</h1>
        </header>
    );
}

export default Header;