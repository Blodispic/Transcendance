import * as React from 'react';
import { useEffect } from "react";
import { socket } from "../../App";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (socket)
        {
            socket.on("RoomStart", (roomId: number) => {
                navigate("/game/" + roomId, { state: { Id: roomId } });
            });
        }
	}, [socket])

    return (
        <div className='scroll'>
            <div className='home-title'>Welcome to ft_transcendance</div>
            <div className='game-desc'>
            <img src={require("../../assets/pong-example.png")} style={{ width: "30%", height: "45%", minWidth: "500px", maxWidth: "1200px",}} alt=""/>

                <span className='game-text'>
                <span >H</span>ere is the pong game, you can play it by clicking on Game in the header.<br/>
                    By default, the game ends when a player get 3 points. You can move right or left by pressing the appropriate arrow key.<br/>
                    If you have the extra features on you can press both left and right to elevate your paddle in order to gain an advantage!<br/>
                    To reduce the lag, the game runs both in the front and in the back, so that the game can anticipate frames if it doesn&apos;t receive them from the back.<br/>
                    You can create a custom match, choose how many points are needed to win and invite a friend to join you.<br/><br/>

                    When the game ends, you get or lose some points and you can go back to the game lobby to play again.
                </span>
            </div>
            <h2>
                <strong><em>The contributors</em></strong>
            </h2>

            <div className='contributors'>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/selee.jpg")} alt=""/>
                    <p className='text'>
                        Seoyoung Lee:<br/>
                        CEO of CSS and HTML.<br/>
                        Responsible for the front of the chat as well as most of the front of the game.
                    </p>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/elabasqu.jpg")} alt=""/>
                    <p className='text'>
                        Emmanuel Labasque:<br/>
                        CEO of Oauth and of bad taste.<br/>
                        Responsible for the front of the profile page and of the login page. He also made the header and routed most of the site.
                    </p>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/gbeco.jpg")} alt=""/>
                    <p className='text'>
                        Guillaume Beco:<br/>
                        CEO of Chat.<br/>
                        Responsible for the back of the chat.
                    </p>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/rozhou.jpg")} alt=""/>
                    <p className='text'>
                        Romain Zhou:<br/>
                        CEO of Databases.<br/>
                        Responsible for the back of the OAuth, 2FA and the database.
                    </p>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/acusanno.jpg")} alt=""/>
                    <p className='text'>
                        Adam Cusanno:<br/>
                        CEO of Pong.<br/>
                        Responsible for the game, as well as the beautiful page you&apos;re reading right now.
                    </p>
                </div>
            </div>

        </div>
    )
}
