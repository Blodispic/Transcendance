import { Injectable, NotFoundException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { Ball, GameState, Move, Player, Vec2 } from './game.interfaces';
import { CreateResultDto } from 'src/results/dto/create-result.dto';
import { Status, User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Results } from 'src/results/entities/results.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
	constructor(
		private readonly userService: UserService,
		@InjectRepository(Results)
    	private readonly resultsRepository: Repository<Results>,
	) { }
	public waitingRoom: any[] = [];
	public gameRoom: Game[] = [];


	async createResult(resultDto: CreateResultDto) {
		const winner = await this.userService.getById(resultDto.winnerId);
		const loser = await this.userService.getById(resultDto.loserId);
		if (!winner || !loser) {
		  throw new NotFoundException("User not found");
		}
		winner.elo += 50;
		loser.elo -= 50;
		winner.win += 1;
		loser.lose += 1;
	
		const result = this.resultsRepository.create({
		  winner,
		  loser,
		  loser_score: resultDto.loser_score,
		  winner_score: resultDto.winner_score,
		  loser_elo: loser.elo,
		  winner_elo: winner.elo,
		});
		return this.resultsRepository.save(result);
	  }

	inGame(playerId: number)
	{
		for (let i:number = 0; i < this.gameRoom.length; i++) {
			if (this.gameRoom[i].gameState.player1.id == playerId || this.gameRoom[i].gameState.player2.id == playerId)
			{
				return true;
			}
		}
		return false;
	}


	async addToWaitingRoom(client: Socket) {
		let i  = 0;
		while (i < this.waitingRoom.length)
		{
			if (this.waitingRoom[i] === client)
				return 1;
			i++;
		}
		this.waitingRoom.push(client);
		return 0;
	}

	removeFromWaitingRoom(client: string)
	{
		let i  = 0;
		while (i < this.waitingRoom.length)
		{
			if (this.waitingRoom[i].id === client)
			{
				this.waitingRoom.splice(i, 1);
				return 0;
			}
			i++;
		}
		return 1;
	}

	startGame(server: Server) {
		if (this.waitingRoom.length >= 2) {
			const socket1 = this.waitingRoom.shift();
			const socket2 = this.waitingRoom.shift();

			const player1: Player = {
				paddle: {
					position: {
						x: GAME_INTERNAL_WIDTH / 2 - paddleDimensions.x / 2,
						y: GAME_INTERNAL_WIDTH * GAME_RATIO - paddleDimensions.y,
					},
					speed: vector_zero(),
					angle: 0,
				},
				input: JSON.parse(JSON.stringify(inputdefault)),
				name: 'Player1',
				score: 0,
				side: 0,
				socket: socket1?.id,
				id: 0,
			};
			const player2: Player = {
				paddle: {
					position: {
						x: GAME_INTERNAL_WIDTH / 2 - paddleDimensions.x / 2,
						y: 0,
					},
					speed: vector_zero(),
					angle: 0,
				},
				input: JSON.parse(JSON.stringify(inputdefault)),
				name: 'Player2',
				score: 0,
				side: 1,
				socket: socket2.id,
				id: 0,
			};
			player1.name = socket1.handshake.auth.user.username;
			player1.id = socket1.handshake.auth.user.id;
			player2.name = socket2.handshake.auth.user.username;
			player2.id = socket2.handshake.auth.user.id;

			this.gameRoom.push(new Game(this, server, player1, player2, true, 3, socket1, socket2, this.gameRoom.length + 1));
			server.to(player1.socket).emit('RoomStart', this.gameRoom.length, player1);
			server.to(player2.socket).emit('RoomStart', this.gameRoom.length, player2);
			this.userService.SetStatus(socket1.handshake.auth.user, Status.Ingame);
			this.userService.SetStatus(socket2.handshake.auth.user, Status.Ingame);
			server.emit('UpdateSomeone', { idChange: socket1.handshake.auth.user.id, idChange2: socket2.handshake.auth.user.id });

		}
		else
			return ('Waiting for more Players...');
	}

	async startCustomGame(server: Server, userSocket1: Socket, userSocket2: Socket, extra: boolean, scoreMax: number) {
		const socket1 = userSocket1;
		const socket2 = userSocket2;
		console.log("START GAME ", socket1.handshake.auth.user.username, socket2.handshake.auth.user.username);
		const player1: Player = {
			paddle: {
				position: {
					x: GAME_INTERNAL_WIDTH / 2 - paddleDimensions.x / 2,
					y: GAME_INTERNAL_WIDTH * GAME_RATIO - paddleDimensions.y,
				},
				speed: vector_zero(),
				angle: 0,
			},
			input: JSON.parse(JSON.stringify(inputdefault)),
			name: 'Player1',
			score: 0,
			side: 0,
			socket: socket1.id,
			id: 0,
		};
		const player2: Player = {
			paddle: {
				position: {
					x: GAME_INTERNAL_WIDTH / 2 - paddleDimensions.x / 2,
					y: 0,
				},
				speed: vector_zero(),
				angle: 0,
			},
			input: JSON.parse(JSON.stringify(inputdefault)),
			name: 'Player2',
			score: 0,
			side: 1,
			socket: socket2.id,
			id: 0,
		};
		player1.name = socket1.handshake.auth.user.username;
		player1.id = socket1.handshake.auth.user.id;
		const user1 = await this.userService.getById(player1.id)
		if (!user1)
			throw new NotFoundException("User Not found");
		if (user1.username)
			player1.name = user1.username;
		player2.name = socket2.handshake.auth.user.username;
		player2.id = socket2.handshake.auth.user.id;
		const user2 = await this.userService.getById(player2.id)
		if (!user2)
			throw new NotFoundException("User Not found");
		if (user2.username)
			player2.name = user2.username;
		if (scoreMax < 1)
			scoreMax = 1;
		else if (scoreMax > 10)
			scoreMax = 10;
		this.gameRoom.push(new Game(this, server, player1, player2, extra, scoreMax, socket1, socket2, this.gameRoom.length + 1));
		this.userService.SetStatus(socket1.handshake.auth.user, Status.Ingame);
		this.userService.SetStatus(socket2.handshake.auth.user, Status.Ingame);
		server.emit('UpdateSomeone', { idChange: socket1.handshake.auth.user.id, idChange2: socket2.handshake.auth.user.id });
		server.to(player1.socket).emit('RoomStart', this.gameRoom.length, player1);
		server.to(player2.socket).emit('RoomStart', this.gameRoom.length, player2);
	}

	updateMove1(move1: Move, client: string, roomId: number) {
		let i = 0;
		while (i < this.gameRoom.length)
		{
			if (this.gameRoom[i].gameState.roomId === roomId
				&& this.gameRoom[i].gameState.player1.socket === client)
			{
				this.gameRoom[i].updateMove1(move1);
				break;
			}
			i++;
		}
	}

	updateMove2(move2: Move, client: string, roomId: number) {
		let i = 0;
		while (this.gameRoom[i])
		{
			if (this.gameRoom[i].gameState.roomId === roomId
				&& this.gameRoom[i].gameState.player2.socket === client)
			{
				this.gameRoom[i].updateMove2(move2);
				return;
			}
			i++;
		}
	}

	playerDisconnect(client: string) {
		let roomId = 0;
		while (roomId < this.gameRoom.length) {
			if (this.gameRoom[roomId].gameState.player1.socket === client
				|| this.gameRoom[roomId].gameState.player2.socket === client)
				this.gameRoom[roomId].disconnect(client);
			roomId++;
		}
	}



	  

	async EndGame(client: string, server: Server) {
		let roomId = 0;
		while (roomId < this.gameRoom.length) {
			if  (this.gameRoom[roomId].gameState.player1.socket === client || this.gameRoom[roomId].gameState.player2.socket === client) {
				
				const user1 = await this.userService.getById(this.gameRoom[roomId].gameState.player1.id);
				const user2 = await this.userService.getById(this.gameRoom[roomId].gameState.player2.id);
				console.log("ENDGAME", user1?.id, ": ", user1?.username , user2?.id, ": ", user2?.username);
				if (user1 && user2)
				{
					console.log(user1.status, user1.status)
					if (user1.status !== Status.Offline)
					await this.userService.SetStatus(user1, Status.Online);  // ACHANGER PAR USERLIST BYY ADAM 
					if (user2.status !== Status.Offline)
					await this.userService.SetStatus(user2, Status.Online);  // ACHANGER PAR USERLIST BYY ADAM 
					server.emit('UpdateSomeone', { idChange: user1.id, idChange2: user2.id });
					this.gameRoom.splice(roomId, 1);
				}
				return;
			}
			roomId++;
        }
    }
}

const GAME_RATIO = 1.5;
const GAME_INTERNAL_WIDTH = 700;

const vector_zero = (): Vec2 => ({ x: 0, y: 0 });

const inputdefault: Move = { right: false, left: false };

const paddleDimensions: Vec2 = { x: 100, y: 10 };
const ballRadius = 10;


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
		name: 'Player1',
		score: 0,
		side: 0,
		socket: '',
		id: 0,
	},
	player2: {
		paddle: {
			position: vector_zero(),
			speed: vector_zero(),
			angle: 0,
		},
		input: inputdefault,
		name: 'Player2',
		score: 0,
		side: 1,
		socket: '',
		id: 0,
	},
	ball: balldefault,
	gameFinished: false,
	extra: true,
	roomId: 0,
};

class Game {
	server: Server;
	public gameState: GameState;
	gameService: GameService;
	socket1: Socket;
	socket2: Socket;
	watchList: string[];

	move1: Move = JSON.parse(JSON.stringify(inputdefault));
	move2: Move = JSON.parse(JSON.stringify(inputdefault));

	constructor(gameService: GameService, server: Server, user1: Player, user2: Player, extra: boolean, scoreMax: number, socket1: Socket, socket2: Socket, roomId: number) {
		this.gameService = gameService;
		this.server = server;
		this.gameState = JSON.parse(JSON.stringify(gameStateDefault));
		this.gameState.gameFinished = false;
		this.gameState.player1 = user1;
		this.gameState.player2 = user2;
		this.resetState(this.gameState);
		this.gameState.player1.id = user1.id;
		this.gameState.player2.id = user2.id;
		this.gameState.player1.score = 0;
		this.gameState.player2.score = 0;
		this.gameState.extra = extra;
		this.socket1 = socket1;
		this.socket2 = socket2;
		this.gameState.scoreMax = scoreMax;
		this.gameState.roomId = roomId;
		
		this.watchList = [];

		this.gameRoomRun();
	}

	gamestateInitializer()
	{
		this.gameState.area = { x: GAME_INTERNAL_WIDTH, y: GAME_INTERNAL_WIDTH * GAME_RATIO };
		this.gameState.scale = 1;
		this.gameState.scoreMax = 3;
		this.gameState.resetCooldown = 60;
		this.gameState.client_area = vector_zero();
		this.gameState.player1 = {
			paddle: {
				position: vector_zero(),
				speed: vector_zero(),
				angle: 0,
			},
			input: JSON.parse(JSON.stringify(inputdefault)),
			name: 'Player1',
			score: 0,
			side: 0,
			socket: '',
			id: 0,
		};
		this.gameState.player2 = {
			paddle: {
				position: vector_zero(),
				speed: vector_zero(),
				angle: 0,
			},
			input: JSON.parse(JSON.stringify(inputdefault)),
			name: 'Player2',
			score: 0,
			side: 1,
			socket: '',
			id: 0,
		};
		this.gameState.ball = balldefault;
		this.gameState.gameFinished = false;
		this.gameState.extra = true;
		this.gameState.roomId = 0;
	}

	addSpectator(client: string) {
		this.watchList.push(client);
	}

	gameRoomRun() {
		const intervalId = setInterval(() => {
			this.gameState = this.updateState(this.gameState);
			if (this.gameState.gameFinished == true)
				clearInterval(intervalId);
		}, 1000 / 60);
	}

	updateMove1(newMove1: Move) {
		this.move1 = JSON.parse(JSON.stringify(newMove1));
	}

	updateMove2(newMove2: Move) {
		this.move2 = JSON.parse(JSON.stringify(newMove2));
	}

	disconnect(client: string) {
		if (this.gameState.player1.socket === client) {
			this.gameState.player2.score = this.gameState.scoreMax;
			this.finishGame();
		}
		else if (this.gameState.player2.socket === client) {
			this.gameState.player1.score = this.gameState.scoreMax;
			this.finishGame();
		}
	}

	async finishGame() {
		console.log("Finish game");
		this.gameState.gameFinished = true;
		let result: CreateResultDto;
		if (this.gameState.player1.score === this.gameState.scoreMax) 
			result = { winnerId: this.gameState.player1.id, loserId: this.gameState.player2.id, winner_score: this.gameState.player1.score.toString(), loser_score: this.gameState.player2.score.toString() };
		else 
			result = { winnerId: this.gameState.player2.id, loserId: this.gameState.player1.id, winner_score: this.gameState.player2.score.toString(), loser_score: this.gameState.player1.score.toString() };
		const Result = await this.gameService.createResult(result);
		this.server.to(this.gameState.player1.socket).emit('GameEnd', Result);
		this.server.to(this.gameState.player2.socket).emit('GameEnd', Result);
	}

	updateGameState(state: GameState) {
		state.scale = state.client_area.x / state.area.x;

		state.player1.input = { ...this.move1 };
		
		state.player2.input = { ...this.move2 };
		if (state.player1.score === state.scoreMax || state.player2.score === state.scoreMax) {
			state.gameFinished = true;
		}
		if (state.resetCooldown <= 0 && state.gameFinished === false) {
			this.movePlayer(state.player1, state);
			this.movePlayer(state.player2, state);
			this.wallCollision(state.ball, state);
			this.moveBall(state.ball);
		}
		else if (state.gameFinished === false)
			state.resetCooldown--;
		return state;
	}

	paddleCollision(ball: Ball, player: Player) {
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
	                ){
						ball.speed.y = ball.speed.y * 1.7;
						if (ball.previous.x + (ball.position.x - ball.previous.x) / 2 < player.paddle.position.x + paddleDimensions.x / 2)
							ball.speed.x -= 3;
						else
							ball.speed.x += 3;
					}
	                else if (
	                    player.input.left === false &&
	                    player.input.right === false &&
	                    ball.previous.y < player.paddle.position.y
	                ){
						ball.speed.y = ball.speed.y * 0.9;
						if (ball.previous.x + (ball.position.x - ball.previous.x) / 2 < player.paddle.position.x + paddleDimensions.x / 2)
							ball.speed.x -= 3;
						else
							ball.speed.x += 3;
					}
	            } else {
	                if (
	                    (player.input.left &&
	                        player.input.right &&
	                        ball.previous.y > player.paddle.position.y) ||
	                    (player.input.left === false &&
	                        player.input.right === false &&
	                        ball.previous.y < player.paddle.position.y)
	                ){
						ball.speed.y = ball.speed.y * 1.7;
						if (ball.previous.x + (ball.position.x - ball.previous.x) / 2 < player.paddle.position.x + paddleDimensions.x / 2)
							ball.speed.x -= 3;
						else
							ball.speed.x += 3;
					}
	                else if (
	                    player.input.left == false &&
	                    player.input.right == false &&
	                    ball.previous.y > player.paddle.position.y
	                ){
						ball.speed.y = ball.speed.y * 0.9;
						if (ball.previous.x + (ball.position.x - ball.previous.x) / 2 < player.paddle.position.x + paddleDimensions.x / 2)
							ball.speed.x -= 3;
						else
							ball.speed.x += 3;
					}
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

	wallCollision(ball: Ball, state: GameState) {
		if (ball.position.x + ballRadius > state.area.x)
		{
			ball.position.x = state.area.x - ballRadius;
			ball.speed.x = -ball.speed.x;
		}
		else if( ball.position.x - ballRadius < 0)
		{
			ball.position.x = 0 + ballRadius;
			ball.speed.x = -ball.speed.x;
		}
		if (
			this.paddleCollision(ball, state.player1) === 0 &&
			this.paddleCollision(ball, state.player2) === 0
		) {
			if (ball.position.y > state.area.y - ballRadius) {
				state.player2.score++;
				this.resetState(state);
				if (state.player2.score >= state.scoreMax) {
					//END THE GAME
					this.finishGame();
				}
			} else if (ball.position.y < 0 + ballRadius) {
				state.player1.score++;
				this.resetState(state);
				if (state.player1.score >= state.scoreMax) {
					//END THE GAME
					this.finishGame();
				}
			}
		}
	}

	resetState(state: GameState) {
		state.resetCooldown = 60;
		state.player1.paddle.position = {
			x: state.area.x / 2 - paddleDimensions.x / 2,
			y: state.area.y - paddleDimensions.y,
		};
		if (state.player1.score === state.scoreMax || state.player2.score === state.scoreMax) {
			state.gameFinished = true;
		}
		else {
			state.gameFinished = false;
		}
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

	moveBall(ball: Ball) {
		ball.previous.x = ball.position.x;
		ball.previous.y = ball.position.y;
		if (ball.speed.y > 12)
			ball.speed.y = 12;
		else if (ball.speed.y < -12)
			ball.speed.y = -12;
		else if (ball.speed.y < 4 && ball.speed.y >= 0)
			ball.speed.y = 4;
		else if (ball.speed.y > -4 && ball.speed.y < 0)
			ball.speed.y = -4;
		if (ball.speed.x > 20)
			ball.speed.x = 20;
		else if (ball.speed.x < -20)
			ball.speed.x = -20;
		else if (ball.speed.x < 1 && ball.speed.x >= 0)
			ball.speed.x = 1;
		else if (ball.speed.x > -1 && ball.speed.x < 0)
			ball.speed.x = -1;
		ball.position.x += ball.speed.x;
		ball.position.y += ball.speed.y;
		if (ball.cooldown > 0) ball.cooldown--;
	}

	movePlayer(player: Player, state: GameState) {
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

	updateState(gameState: GameState) {
		gameState = this.updateGameState({ ...gameState });
		this.server.to(this.gameState.player1.socket).emit('UpdateState', gameState, 1);
		this.server.to(this.gameState.player2.socket).emit('UpdateState', gameState, 2);
		let i = 0;
		while (this.watchList[i]) {
			this.server.to(this.watchList[i]).emit('UpdateState', gameState, 0);
			i++;
		}
		return gameState;
	}
}
