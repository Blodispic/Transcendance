import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function ResultPopup(props: any) {
	const navigate = useNavigate();
	let message: string = "";

	if (props.win == true)
		message = "You won!";
	else
		message = "You lost!";

	return (
		<div className='result-popup' style={{zIndex: 100}} onClick={_ => navigate("/Game")}>
			<div className='result-popup-inner'>
				Congratulations! <br />{message}
			</div>
		</div>
	);
}