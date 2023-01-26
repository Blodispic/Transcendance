import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/game.scss";

export function Victory() {
	return (
		<h1>
			"Congratulations you Won!"
		</h1>
	);
}

export function Defeat() {


	return (
		<h1>
			"Congratulations you Lost!"
		</h1>
	);
}

export function Result(props: any, result: boolean) {

	let message: string;
	if (result == true)
		message = "Congratulations! You won!";
	else
		message = "Oh no! You lost!";

	return (props.trigger) ? (
		<div id="game-container">
			<div className='result-popup'>
				<Link to="/Game">
				<div className='result-popup-inner' onClick={() => props.setTrigger(false)} >
				<h2>{message}</h2>
				{/* <button onClick={() => props.setTrigger(false)}>close</button> */}
				</div>
				</Link>
			</div>
		</div>
	) : <div></div>;
}