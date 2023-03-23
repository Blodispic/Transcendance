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
	id: number
	paddle: Paddle;
	input: Move;
	name: string;
	socket: string;
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
	extra: boolean;
	roomId: number;
}
