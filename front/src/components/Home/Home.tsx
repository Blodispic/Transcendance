import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {


    return (
        <div>
            <text className='home-title'>Welcome to ft_transcendance</text>
            <div className='game-desc'>
                <img className='img-style' width="30%" height="45%" min-width="500px" max-width="1200px" src={require("../../assets/pong-example.png")}/>
                <text className='game-text'>
                <span >H</span>ere is the pong game, you can play it by clicking on Game in the header.<br/>
                    By default, the game ends when a player get 3 points. You can move right or left by pressing the appropriate arrow key.<br/>
                    If you have the extra features on you can press both left and right to elevate your paddle in order to gain an advantage!<br/>
                    To reduce the lag, the game runs both in the front and in the back, so that the game can anticipate frames if it doesn't receive them from the back.<br/>
                    You can create a custom match, choose how many points are needed to win and invite a friend to join you.<br/><br/>

                    When the game ends, you get or loose some points and you can go back to the game lobby to play again.
                </text>
            </div>
        </div>
    )
}