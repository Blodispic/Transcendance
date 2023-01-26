import { useEffect, useState } from "react";
import { Circle, Layer, Rect, Stage, Text } from "react-konva";
import io from 'socket.io-client';
import "../../styles/game.scss";
import { useLocation } from 'react-router-dom';
import { Victory, Defeat } from "./Result";
// import { socket } from "../../App";


export const socket = io("http://" + window.location.hostname + ":4000");

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
}

const GAME_RATIO = 1.5;
const GAME_INTERNAL_WIDTH = 700;

let inputdefault: Move = { right: false, left: false };

let move1: Move = { ...inputdefault };
let move2: Move = { ...inputdefault };
let paddleDimensions: Vec2 = { x: 100, y: 10 };
let ballRadius: number = 10;

const vector_zero = (): Vec2 => ({ x: 0, y: 0 });

let balldefault: Ball = {
	position: vector_zero(),
	speed: vector_zero(),
	previous: vector_zero(),
	cooldown: 0,
};

let gameStateDefault: GameState = {
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
	},
	ball: balldefault,
	gameFinished: false,
};

resetState(gameStateDefault);

export default function GameApp() {
	const [gameState, setGameState] = useState<GameState>(gameStateDefault);
	const [isConnected, setIsConnected] = useState(socket.connected);
	let [myVar, setMyvar] = useState<boolean | undefined>(undefined)

	useEffect(() => {		console.log("var = ", myVar);
		setInterval(() => {
			updateState(setGameState);
		}, 1000 / 60);

		socket.on('connect', () => {
			setIsConnected(true);
			console.log("Connected");
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
			console.log("Disconnected");
		});

		socket.on("UpdateState", (newGameState: GameState) => {
			// console.log("ball.x before: " + newGameState.ball.position.x);
			// let newState: GameState = convertState(newGameState);

			newGameState = convertState(newGameState);
			// console.log("ball.x after: " + newGameState.ball.position.x);
			setGameState(newGameState);
			// setGameState(convertState(newGameState));
		});

		socket.on("GameEnd", (result: any) => {
			console.log("CA PASSE ALALALALALLALALALAL");
			
			console.log(result.winner, " won");
			console.log(myVar);
		
			
			if (result.winner === gameState.player1.name)
				setMyvar(true);
			else if (result.winner === gameState.player2.name)
				setMyvar(false);
							console.log(myVar);
			socket.emit("GameEnd", null);
		});

		document.addEventListener("keydown", keyEvent);
		document.addEventListener("keyup", keyEvent);

		// At the end of the component remove the listener using return
		return () => {
			document.removeEventListener("keydown", keyEvent);
			document.removeEventListener("keyup", keyEvent);
			// socket.offAny();
			socket.removeAllListeners()
		};	
;
	}, []);

	//  Here to modify game page
	return (
		<div id="game-container">
		
			{
				myVar == true &&
				<Victory />
			}
			{
				myVar == false &&
				<Defeat />
			}
			<h3>
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
			<h3>
				{gameState.player1.name} : {gameState.player1.score}
			</h3>
		</div>
	);
}

function convertState(state: GameState) {
	state.client_area.x = Math.min((window.innerWidth * 70) / 100, GAME_INTERNAL_WIDTH);
	state.client_area.y = state.client_area.x * GAME_RATIO;
	let newState: GameState = gameStateDefault;

	newState.ball.position.x = state.ball.position.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.ball.position.y = state.ball.position.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));

	newState.ball.speed.x = state.ball.speed.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.ball.speed.y = state.ball.speed.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));
	newState.ball.previous.x = state.ball.previous.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.ball.previous.y = state.ball.previous.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));

	newState.ball.cooldown = state.ball.cooldown;

	// newState.player1 = state.player1;
	newState.player1.input = state.player1.input;
	newState.player1.name = state.player1.name;
	newState.player1.score = state.player1.score;
	newState.player1.side = state.player1.side;

	newState.player1.paddle.position.x = state.player1.paddle.position.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.player1.paddle.position.y = state.player1.paddle.position.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));
	newState.player1.paddle.speed.x = state.player1.paddle.speed.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.player1.paddle.speed.y = state.player1.paddle.speed.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));

	// newState.player2 = state.player2;
	newState.player2.input = state.player2.input;
	newState.player2.name = state.player2.name;
	newState.player2.score = state.player2.score;
	newState.player2.side = state.player2.side;

	newState.player2.paddle.position.x = state.player2.paddle.position.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.player2.paddle.position.y = state.player2.paddle.position.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));
	newState.player2.paddle.speed.x = state.player2.paddle.speed.x * (state.client_area.x / GAME_INTERNAL_WIDTH);
	newState.player2.paddle.speed.y = state.player2.paddle.speed.y * (state.client_area.y / (GAME_INTERNAL_WIDTH * GAME_RATIO));

	newState.resetCooldown = state.resetCooldown;

	// console.log("padlePosition = x: " + Math.round(newState.player1.paddle.position.x));
	// console.log("padlePosition = y: " + Math.round(newState.player1.paddle.position.y) + "\n");
	// console.log("resetCooldown = " + newState.resetCooldown);
	// console.log("ballPosition = x: " + Math.round(newState.ball.position.x));
	// console.log("ballPosition = y: " + Math.round(newState.ball.position.y));

	return newState;
}

function updateGameState(state: GameState) {
	state.client_area.x = Math.min((window.innerWidth * 70) / 100, state.area.x);
	state.client_area.y = state.client_area.x * GAME_RATIO;
	state.scale = state.client_area.x / state.area.x;

	state.player1.input = { ...move1 };
	state.player2.input = { ...move2 };
	if (state.gameFinished === false && (state.player1.score === state.scoreMax || state.player2.score === state.scoreMax)) {
		state.gameFinished = true;
	}
	if (state.resetCooldown === 0 && state.gameFinished === false) {
		movePlayer(state.player1, state);
		movePlayer(state.player2, state);
		wallCollision(state.ball, state);
		moveBall(state.ball);
	}
	else if (state.gameFinished === false)
		state.resetCooldown--;
	return state;
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
				else if (
					player.input.left &&
					player.input.right &&
					ball.previous.y > player.paddle.position.y
				)
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
		if (player.input.left && player.input.right)
			player.paddle.speed.y = -4;
		else if (player.input.left && player.paddle.position.x > 0)
			player.paddle.speed.x = -8;
		else if (player.input.right && player.paddle.position.x < state.area.x - paddleDimensions.x)
			player.paddle.speed.x = 8;
		else if (player.paddle.position.y + paddleDimensions.y < state.area.y)
			player.paddle.speed.y = 2;
	}
	else {
		if (player.input.left && player.input.right)
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
	let key = event.key;
	let keyState = event.type === "keydown";
	if (key === "ArrowLeft" && keyState) {
		//move left
		move1.left = true;
	} else if (key === "ArrowLeft") {
		//move left
		move1.left = false;
	} else if (key === "ArrowRight" && keyState) {
		//move left
		move1.right = true;
	} else if (key === "ArrowRight") {
		//move left
		move1.right = false;
	}

	if ((key === "A" || key === "a") && keyState) {
		//move left
		move2.left = true;
	} else if (key === "A" || key === "a") {
		//move left
		move2.left = false;
	} else if ((key === "D" || key === "d") && keyState) {
		//move left
		move2.right = true;
	} else if (key === "D" || key === "d") {
		//move left
		move2.right = false;
	}
	if (key === "ArrowLeft" || key === "ArrowRight")
		socket.emit("Move1", move1);
	else
		socket.emit("Move2", move2);
	// socket.removeAllListeners()
}

function updateState(setGameState: Function) {
	setGameState((prev: GameState) => {
		return updateGameState({ ...prev });
	});
}

// export default GameApp;