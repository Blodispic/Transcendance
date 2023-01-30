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
