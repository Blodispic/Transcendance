import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ResultPopup(props: any) {
	const navigate = useNavigate();
	let message = "";

	if (props.win === 1)
		message = "You won!";
	else if (props.win === 2)
		message = "You lost!";
	else
		message = "You spectated!"

	return (
		<div className='result-popup' style={{zIndex: 100}} onClick={() => navigate("/Game")}>
			<div className='result-popup-inner'>
				Congratulations! <br />{message}
			</div>
		</div>
	);
}