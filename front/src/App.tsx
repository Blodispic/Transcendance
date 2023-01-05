import { useEffect, useState } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";
import "./styles/game.scss";

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
	client_area: Vec2;
	player1: Player;
	player2: Player;
	ball: Ball;
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
};

resetState(gameStateDefault);

function App() {
	const [gameState, setGameState] = useState<GameState>(gameStateDefault);
	useEffect(() => {
		setInterval(() => {
			updateState(setGameState);
		}, 1000 / 60);

		document.addEventListener("keydown", keyEvent);
		document.addEventListener("keyup", keyEvent);

		// At the end of the component remove the listener using return
		return () => {
			document.removeEventListener("keydown", keyEvent);
			document.removeEventListener("keyup", keyEvent);
		};
	}, []);

	//  Here to modify game page
	return (
		<div id="game-container">
			<h3>
				{gameState.player1.name} {gameState.player1.score}
			</h3>
			<Stage
				width={gameState.client_area.x}
				height={gameState.client_area.y}
				scaleX={gameState.scale}
				scaleY={gameState.scale}
			>
				<Layer>
					<Rect
						cornerRadius={50}
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
				</Layer>
			</Stage>
			<h3>
				{gameState.player2.name} {gameState.player2.score}
			</h3>
		</div>
	);
}

function updateGameState(state: GameState) {
	state.client_area.x = Math.min((window.innerWidth * 70) / 100, 700);
	state.client_area.y = state.client_area.x * GAME_RATIO;
	state.scale = state.client_area.x / state.area.x;

	state.player1.input = { ...move1 };
	state.player2.input = { ...move2 };
	movePlayer(state.player1, state);
	movePlayer(state.player2, state);
	wallCollision(state.ball, state);
	moveBall(state.ball);
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
		} else if (ball.position.y < 0 + ballRadius) {
			resetState(state);
			state.player1.score++;
		}
	}
}

function resetState(state: GameState) {
	state.player1.paddle.position = {
		x: state.area.x / 2 - paddleDimensions.x / 2,
		y: state.area.y - paddleDimensions.y,
	};
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

	state.ball.speed.x = Math.random() * -6;
	if (state.player1.score > state.player2.score)
		state.ball.speed.y = Math.random() * (5 - 1.5) + 1.5;
	else state.ball.speed.y = -(Math.random() * (5 - 1.5) + 1.5);
}

function moveBall(ball: Ball) {
	ball.previous.x = ball.position.x;
	ball.previous.y = ball.position.y;
	if (ball.speed.y > 12) ball.speed.y = 12;
	else if (ball.speed.y < -12) ball.speed.y = -12;
	else if (ball.speed.y < 4 && ball.speed.y > 0) ball.speed.y = 4;
	else if (ball.speed.y > -4 && ball.speed.y < 0) ball.speed.y = -4;
	if (ball.speed.x > 15) ball.speed.x = 15;
	else if (ball.speed.x < -15) ball.speed.x = -15;
	else if (ball.speed.x < 4 && ball.speed.x > 0) ball.speed.x = 4;
	else if (ball.speed.x > -4 && ball.speed.x < 0) ball.speed.x = -4;
	ball.position.x += ball.speed.x;
	ball.position.y += ball.speed.y;
	if (ball.cooldown > 0) ball.cooldown--;
}

function movePlayer(player: Player, state: GameState) {
	player.paddle.speed = { x: 0, y: 0 };
	if (player.side === 0) {
		if (player.input.left && player.input.right) player.paddle.speed.y = -4;
		else if (player.input.left && player.paddle.position.x > 0)
			player.paddle.speed.x = -8;
		else if (
			player.input.right &&
			player.paddle.position.x < state.area.x - paddleDimensions.x
		)
			player.paddle.speed.x = 8;
		else if (player.paddle.position.y + paddleDimensions.y < state.area.y)
			player.paddle.speed.y = 2;
	} else {
		if (player.input.left && player.input.right) player.paddle.speed.y = 4;
		else if (player.input.left && player.paddle.position.x > 0)
			player.paddle.speed.x = -8;
		else if (
			player.input.right &&
			player.paddle.position.x < state.area.x - paddleDimensions.x
		)
			player.paddle.speed.x = 8;
		else if (player.paddle.position.y > 0) player.paddle.speed.y = -2;
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
}

function updateState(setGameState: Function) {
	setGameState((prev: GameState) => {
		return updateGameState({ ...prev });
	});
}

export default App;
