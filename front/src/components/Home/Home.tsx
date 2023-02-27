import { useState } from "react";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import InviteInGame from "../utils/InviteGame";

export default function Home() {

    return (
        <div className='scroll'>
            <a className='home-title'>Welcome to ft_transcendance</a>
            <div className='game-desc'>
                <img width="30%" height="45%" min-width="500px" max-width="1200px" src={require("../../assets/pong-example.png")}/>
                <a className='game-text'>
                <span >H</span>ere is the pong game, you can play it by clicking on Game in the header.<br/>
                    By default, the game ends when a player get 3 points. You can move right or left by pressing the appropriate arrow key.<br/>
                    If you have the extra features on you can press both left and right to elevate your paddle in order to gain an advantage!<br/>
                    To reduce the lag, the game runs both in the front and in the back, so that the game can anticipate frames if it doesn't receive them from the back.<br/>
                    You can create a custom match, choose how many points are needed to win and invite a friend to join you.<br/><br/>

                    When the game ends, you get or lose some points and you can go back to the game lobby to play again.
                </a>
            </div>
            <h2>
                <strong><em>The contributors</em></strong>
            </h2>

            <div className='contributors'>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/selee.jpg")}/>
                    <a className='text'>
                        Seoyoung Lee:<br/>
                        CEO of CSS and HTML.<br/>
                        Responsible for the front of the chat as well as most of the front of the game.
                    </a>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/elabasqu.jpg")}/>
                    <a className='text'>
                        Emmanuel Labasque:<br/>
                        CEO of Oauth and of bad taste.<br/>
                        Responsible for the front of the profile page and of the login page. He also made the header and routed most of the site.
                    </a>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/gbeco.jpg")}/>
                    <a className='text'>
                        Guillaume Beco:<br/>
                        CEO of Chat.<br/>
                        Responsible for the back of the chat.
                    </a>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/rozhou.jpg")}/>
                    <a className='text'>
                        Romain Zhou:<br/>
                        CEO of Databases.<br/>
                        Responsible for the back of the OAuth, 2FA and the database.
                    </a>
                </div>
                <div className='contributor'>
                    <img className='avatar' src={require("../../assets/contributors/acusanno.jpg")}/>
                    <a className='text'>
                        Adam Cusanno:<br/>
                        CEO of Pong.<br/>
                        Responsible for the game, as well as the beautiful page you're reading right now.
                    </a>
                </div>
            </div>

        </div>
    )
}
