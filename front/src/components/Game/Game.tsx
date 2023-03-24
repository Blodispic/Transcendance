import * as React from 'react';
import { useEffect, useState } from "react";
import { Circle, Layer, Rect, Stage, Text } from "react-konva";
import { socket } from "../../App";
import { ResultPopup } from "./Result";
import swal from "sweetalert";


export interface Vec2 {
	x: number;
	y: number;
}

export interface Paddle {
	position: Vec2;
	speed: Vec2;
	angle: number;
}

export interface Move {
	left: boolean;
	right: boolean;
}

export interface Player {
	paddle: Paddle;
	input: Move;
	name: string;
	score: number;
	side: number;
	id: number;
}

export interface Ball {
	position: Vec2;
	speed: Vec2;
	previous: Vec2;
	cooldown: number;
}

export interface GameState {
	area: Vec2;
	scale: number;
	scoreMax: number;
	resetCooldown: number;
	client_area: Vec2;
	player1: Player;
	player2: Player;
	ball: Ball;
	gameFinished: boolean;
	extra: boolean;
	roomId: number;
}

const GAME_RATIO = 1.5;
const GAME_INTERNAL_WIDTH = 700;

const inputdefault: Move = { right: false, left: false };

const move1: Move = { ...inputdefault };
const move2: Move = { ...inputdefault };
const paddleDimensions: Vec2 = { x: 100, y: 10 };
const ballRadius = 10;

let selfID = 0;
let roomId = 0;

const vector_zero = (): Vec2 => ({ x: 0, y: 0 });

const balldefault: Ball = {
	position: vector_zero(),
	speed: vector_zero(),
	previous: vector_zero(),
	cooldown: 0,
};

const gameStateDefault: GameState = {
	area: { x: GAME_INTERNAL_WIDTH, y: GAME_INTERNAL_WIDTH * GAME_RATIO },
	scale: 1,
	scoreMax: 3,
	resetCooldown: 60,
	client_area: vector_zero(),
	player1: {
		paddle: {
			position: vector_zero(),
			speed: vector_zero(),
			angle: 0,
		},
		input: inputdefault,
		name: "Player1",
		score: 0,
		side: 0,
		id: 0,
	},
	player2: {
		paddle: {
			position: vector_zero(),
			speed: vector_zero(),
			angle: 0,
		},
		input: inputdefault,
		name: "Player2",
		score: 0,
		side: 1,
		id: 0,
	},
	ball: balldefault,
	gameFinished: false,
	extra: true,
	roomId: 0,
};

resetState(gameStateDefault);

export default function GameApp() {
	const [gameState, setGameState] = useState<GameState>(gameStateDefault);
	const [result, setResult] = useState<boolean>()
	const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

	useEffect(() => {
		setIntervalId(
			setInterval(() => {
				setGameState(updateGameState);
			}, 1000 / 60)
		);

		socket.on("UpdateState", (newGameState: GameState, player: number) => {	
			const convertedState: GameState = convertState(newGameState);
			selfID = player;
			setGameState(convertedState);
			});

		socket.on("GameEnd", (result: any) => {
			if (selfID === 1)
			{
				if (result.winner === gameState.player1.name)
					setResult(true);
				else if (result.winner === gameState.player2.name)
					setResult(false);
			}
			else
			{
				if (result.winner === gameState.player1.name)
					setResult(false);
				else if (result.winner === gameState.player2.name)
					setResult(true);
			}
			socket.emit("GameEnd", null);
			return () => {
				socket.off('UpdateState');
				socket.off('GameEnd');
			};
		});

		document.addEventListener("keydown", keyEvent);
		document.addEventListener("keyup", keyEvent);

		// At the end of the component remove the listener using return
		return () => {
			clearInterval(intervalId);
			document.removeEventListener("keydown", keyEvent);
			document.removeEventListener("keyup", keyEvent);
			socket.off("UpdateState");
			socket.off('GameEnd');

			socket.emit("PlayerLeft");
		};
	}, []);
	
	//  Here to modify game page
	return (
		<div id="game-container">
			{ gameState.gameFinished ? (result ? <ResultPopup win={true} /> : <ResultPopup win={false} />) : <></> }
			<h3 className="display-player">
				<img src={`${process.env.REACT_APP_BACK}user/${gameState.player2.id}/avatar`} alt={gameState.player2.name} />
				{gameState.player2.name} : {gameState.player2.score}
			</h3>
			<Stage
				width={gameState.client_area.x}
				height={gameState.client_area.y}
				scaleX={gameState.scale}
				scaleY={gameState.scale}
			>
				<Layer>
					<Rect
						cornerRadius={30}
						width={gameState.area.x}
						height={gameState.area.y}
						fill="#C1C8E4"
					/>
				</Layer>
				<Layer>
					<Circle
						radius={ballRadius}
						x={gameState.ball.position.x}
						y={gameState.ball.position.y}
						fill="white"
					/>
					<Rect
						cornerRadius={50}
						x={gameState.player1.paddle.position.x}
						y={gameState.player1.paddle.position.y}
						fill="white"
						width={paddleDimensions.x}
						height={paddleDimensions.y}
					/>
					<Rect
						cornerRadius={50}
						x={gameState.player2.paddle.position.x}
						y={gameState.player2.paddle.position.y}
						fill="white"
						width={paddleDimensions.x}
						height={paddleDimensions.y}
					/>
					<Text
						text={gameState.player1.name.toString() + " wins !"}
						visible={gameState.gameFinished}
						x={gameState.area.x / 2 - 150}
						y={gameState.area.y / 2}
						fontSize={40}
						align="center"
					/>
				</Layer>
			</Stage>
			<h3 className="display-player">
			<img src={`${process.env.REACT_APP_BACK}user/${gameState.player1.id}/avatar`} alt={gameState.player1.name}/>
			
				{gameState.player1.name} : {gameState.player1.score}
			</h3>
		</div>
	);
}

function convertState(state: GameState) {
	// state.client_area.x = Math.min((window.innerWidth * 70) / 100, GAME_INTERNAL_WIDTH);
	// state.client_area.y = state.client_area.x * GAME_RATIO;
	if (window.innerHeight > GAME_RATIO * window.innerWidth)
	{
		state.client_area.x = Math.min((window.innerWidth * 70) / 100, GAME_INTERNAL_WIDTH);
		state.client_area.y = state.client_area.x * GAME_RATIO;
	}
	else
	{
		state.client_area.y = Math.min((window.innerHeight * 75) / 100, GAME_INTERNAL_WIDTH * GAME_RATIO);
		state.client_area.x = state.client_area.y / GAME_RATIO;
	}

	const newState: GameState = gameStateDefault;
	newState.scale = state.client_area.x / state.area.x;

	newState.ball.position.x = state.ball.position.x;
	newState.ball.position.y = state.ball.position.y;

	newState.ball.speed.x = state.ball.speed.x;
	newState.ball.speed.y = state.ball.speed.y;
	newState.ball.previous.x = state.ball.previous.x;
	newState.ball.previous.y = state.ball.previous.y;

	newState.ball.cooldown = state.ball.cooldown;

	// newState.player1 = state.player1;
	newState.player1.input = state.player1.input;
	newState.player1.name = state.player1.name;
	newState.player1.score = state.player1.score;
	newState.player1.side = state.player1.side;

	newState.player1.paddle.position.x = state.player1.paddle.position.x;
	newState.player1.paddle.position.y = state.player1.paddle.position.y;
	newState.player1.paddle.speed.x = state.player1.paddle.speed.x;
	newState.player1.paddle.speed.y = state.player1.paddle.speed.y;

	// newState.player2 = state.player2;
	newState.player2.input = state.player2.input;
	newState.player2.name = state.player2.name;
	newState.player2.score = state.player2.score;
	newState.player2.side = state.player2.side;

	newState.player2.paddle.position.x = state.player2.paddle.position.x;
	newState.player2.paddle.position.y = state.player2.paddle.position.y;
	newState.player2.paddle.speed.x = state.player2.paddle.speed.x;
	newState.player2.paddle.speed.y = state.player2.paddle.speed.y;

	newState.resetCooldown = state.resetCooldown;

	newState.extra = state.extra;
	newState.scoreMax = state.scoreMax;
	newState.roomId = state.roomId;
	roomId = state.roomId;
	newState.player1.id = state.player1.id;
	newState.player2.id = state.player2.id;
	return newState;
}

function updateGameState(prev: GameState) {
	const newState = { ...prev }
	if (swal && swal.close !== undefined && swal.stopLoading !== undefined)
	{
		// swal("Success", "You've been added to the custom room.", "success");
		// swal.stopLoading();
		swal.close();
	}

	if (window.innerHeight > GAME_RATIO * window.innerWidth)
	{
		newState.client_area.x = Math.min((window.innerWidth * 70) / 100, newState.area.x);
		newState.client_area.y = newState.client_area.x * GAME_RATIO;
	}
	else
	{
		newState.client_area.y = Math.min((window.innerHeight * 75) / 100, newState.area.y);
		newState.client_area.x = newState.client_area.y / GAME_RATIO;
	}
	newState.scale = newState.client_area.x / newState.area.x;

	newState.player1.input = { ...move1 };
	newState.player2.input = { ...move2 };
	if (newState.gameFinished === false && (newState.player1.score >= newState.scoreMax || newState.player2.score >= newState.scoreMax)) {
		newState.gameFinished = true;
	}
	if (newState.resetCooldown === 0 && newState.gameFinished === false) {
		movePlayer(newState.player1, newState);
		movePlayer(newState.player2, newState);
		wallCollision(newState.ball, newState);
		moveBall(newState.ball);
	}
	else if (newState.gameFinished === false)
		newState.resetCooldown--;
	return newState;
}

function paddleCollision(ball: Ball, player: Player) {
	if (ball.cooldown === 0) {
		if (
			((ball.previous.y - ballRadius <
				player.paddle.position.y - paddleDimensions.y / 2 &&
				ball.position.y + ballRadius >
				player.paddle.position.y - paddleDimensions.y / 2) ||
				(ball.previous.y + ballRadius >
					player.paddle.position.y + paddleDimensions.y / 2 &&
					ball.position.y - ballRadius <
					player.paddle.position.y + paddleDimensions.y / 2)) &&
			ball.position.x + ballRadius > player.paddle.position.x &&
			ball.position.x - ballRadius <
			player.paddle.position.x + paddleDimensions.x
		) {
			if (player.side === 0) {
				if (
					(player.input.left &&
						player.input.right &&
						ball.previous.y < player.paddle.position.y) ||
					(player.input.left === false &&
						player.input.right === false &&
						ball.previous.y > player.paddle.position.y)
				)
					ball.speed.y = ball.speed.y * (Math.random() * (2 - 1.5) + 1.5);
				else if (
					player.input.left === false &&
					player.input.right === false &&
					ball.previous.y < player.paddle.position.y
				)
					ball.speed.y = ball.speed.y * (Math.random() * (1 - 0.8) + 0.8);
			} else {
				if (
					(player.input.left &&
						player.input.right &&
						ball.previous.y > player.paddle.position.y) ||
					(player.input.left === false &&
						player.input.right === false &&
						ball.previous.y < player.paddle.position.y)
				)
					ball.speed.y = ball.speed.y * (Math.random() * (2 - 1.5) + 1.5);
				// ca passe jamais dedans
				// else if (
				// 	player.input.left &&
				// 	player.input.right &&
				// 	ball.previous.y > player.paddle.position.y
				// )
					ball.speed.y = ball.speed.y * (Math.random() * (1 - 0.8) + 0.8);
			}

			if (
				(ball.previous.y < player.paddle.position.y && ball.speed.y > 0) ||
				(ball.previous.y > player.paddle.position.y && ball.speed.y < 0)
			) {
				ball.speed.y = -ball.speed.y;
				if (ball.speed.y > 0) ball.position.y += 5;
				else ball.position.y -= 5;
			} else {
				if (ball.speed.y > 0) ball.position.y += 5;
				else ball.position.y -= 5;
			}
			ball.cooldown = 1;
			const sound = new Audio(require("../../assets/ponghitside.ogg"));
			sound.play();
			return 1;
		}
	}
	return 0;
}

function wallCollision(ball: Ball, state: GameState) {
	if (
		ball.position.x + ballRadius > state.area.x ||
		ball.position.x - ballRadius < 0
	)
		ball.speed.x = -ball.speed.x;
	if (
		paddleCollision(ball, state.player1) === 0 &&
		paddleCollision(ball, state.player2) === 0
	) {
		if (ball.position.y > state.area.y - ballRadius) {
			resetState(state);
			state.player2.score++;
			if (state.player2.score === state.scoreMax) {
				//END THE GAME
				state.gameFinished = true;
			}
		} else if (ball.position.y < 0 + ballRadius) {
			resetState(state);
			state.player1.score++;
			if (state.player1.score === state.scoreMax) {
				//END THE GAME
				state.gameFinished = true;
			}
		}
	}
}

function resetState(state: GameState) {
	state.resetCooldown = 60;
	state.player1.paddle.position = {
		x: state.area.x / 2 - paddleDimensions.x / 2,
		y: state.area.y - paddleDimensions.y,
	};
	if (state.gameFinished === false && (state.player1.score === state.scoreMax || state.player2.score === state.scoreMax))
		state.gameFinished = true;
	state.player1.paddle.speed = { x: 0, y: 0 };
	state.player1.paddle.angle = 0;

	state.player2.paddle.position = {
		x: state.area.x / 2 - paddleDimensions.x / 2,
		y: 0,
	};
	state.player2.paddle.speed = { x: 0, y: 0 };
	state.player2.paddle.angle = 0;

	state.ball.position = { x: state.area.x / 2 - 10, y: state.area.y / 2 - 10 };
	state.ball.speed = { x: 5, y: 1 };
	state.ball.previous = { x: state.area.x / 2 - 10, y: state.area.y / 2 - 10 };

	state.ball.speed.x = (Math.random() * (20) - 10);
	if (state.player1.score > state.player2.score)
		state.ball.speed.y = Math.random() * (5 - 1.5) + 1.5;
	else state.ball.speed.y = -(Math.random() * (5 - 1.5) + 1.5);
}

function moveBall(ball: Ball) {
	ball.previous.x = ball.position.x;
	ball.previous.y = ball.position.y;
	if (ball.speed.y > 12)
		ball.speed.y = 12;
	else if (ball.speed.y < -12)
		ball.speed.y = -12;
	else if (ball.speed.y < 4 && ball.speed.y > 0)
		ball.speed.y = 4;
	else if (ball.speed.y > -4 && ball.speed.y < 0)
		ball.speed.y = -4;
	if (ball.speed.x > 15)
		ball.speed.x = 15;
	else if (ball.speed.x < -15)
		ball.speed.x = -15;
	else if (ball.speed.x < 1 && ball.speed.x > 0)
		ball.speed.x = 1;
	else if (ball.speed.x > -1 && ball.speed.x < 0)
		ball.speed.x = -1;
	ball.position.x += ball.speed.x;
	ball.position.y += ball.speed.y;
	if (ball.cooldown > 0) ball.cooldown--;
}

function movePlayer(player: Player, state: GameState) {
	player.paddle.speed = { x: 0, y: 0 };
	if (player.side === 0) {
		if (state.extra === false && player.input.left && player.input.right)
			player.paddle.speed.y = 0;
		else if (state.extra && player.input.left && player.input.right)
			player.paddle.speed.y = -4;
		else if (player.input.left && player.paddle.position.x > 0)
			player.paddle.speed.x = -8;
		else if (player.input.right && player.paddle.position.x < state.area.x - paddleDimensions.x)
			player.paddle.speed.x = 8;
		else if (player.paddle.position.y + paddleDimensions.y < state.area.y)
			player.paddle.speed.y = 2;
	}
	else {
		if (state.extra === false && player.input.left && player.input.right)
			player.paddle.speed.y = 0;
		else if (state.extra && player.input.left && player.input.right)
			player.paddle.speed.y = 4;
		else if (player.input.left && player.paddle.position.x > 0)
			player.paddle.speed.x = -8;
		else if (player.input.right && player.paddle.position.x < state.area.x - paddleDimensions.x)
			player.paddle.speed.x = 8;
		else if (player.paddle.position.y > 0)
			player.paddle.speed.y = -2;
	}

	player.paddle.position.x += player.paddle.speed.x;
	player.paddle.position.y += player.paddle.speed.y;
}

function keyEvent(event: KeyboardEvent) {
	const key = event.key;
	const keyState = event.type === "keydown";
	if (key === "ArrowLeft" && keyState && selfID === 1) {
		//move left
		move1.left = true;
	} else if (key === "ArrowLeft" && selfID === 1) {
		//move left
		move1.left = false;
	} else if (key === "ArrowRight" && keyState && selfID === 1) {
		//move left
		move1.right = true;
	} else if (key === "ArrowRight" && selfID === 1) {
		//move left
		move1.right = false;
	}

	if (key === "ArrowLeft" && keyState && selfID === 2) {
		//move left
		move2.left = true;
	} else if (key === "ArrowLeft" && selfID === 2) {
		//move left
		move2.left = false;
	} else if (key === "ArrowRight" && keyState && selfID === 2) {
		//move left
		move2.right = true;
	} else if (key === "ArrowRight" && selfID === 2) {
		//move left
		move2.right = false;
	}

	if ((key === "ArrowLeft" || key === "ArrowRight") && selfID === 1)
		socket.emit("Move1", {input: move1, roomId: roomId});
	else if ((key === "ArrowLeft" || key === "ArrowRight") && selfID === 2)
		socket.emit("Move2", {input: move2, roomId: roomId});
}
