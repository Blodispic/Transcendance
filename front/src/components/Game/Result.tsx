import React from 'react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import "../../styles/game.scss";

export function Victory() {
	const navigate = useNavigate();
	return (
		<div className='result-popup'style={{zIndex: 100}}>
			<div className='result-popup-inner' onClick={_ => navigate("/Game") }>
				Congratulations! <br />You won!
			</div>
		</div>
	);
}

export function Defeat() {
	const navigate = useNavigate();
	return (
		<div className='result-popup' style={{zIndex: 100}}>
			<div className='result-popup-inner' onClick={_ => navigate("/Game")}>
				Congratulations! <br />You lost!
			</div>
		</div>
	);
}
