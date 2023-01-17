import { Injectable } from "@nestjs/common";
import { Socket } from "dgram";
import { start } from "repl";
import { Server } from "socket.io";
import { Ball, GameState, Move, Player, Vec2 } from "./game.interfaces";

const GAME_RATIO = 1.5;
const GAME_INTERNAL_WIDTH = 700;

const vector_zero = (): Vec2 => ({ x: 0, y: 0 });

let inputdefault: Move = { right: false, left: false };

let move1: Move = { ...inputdefault };
let move2: Move = { ...inputdefault };
let paddleDimensions: Vec2 = { x: 100, y: 10 };
let ballRadius: number = 10;


let balldefault: Ball = {
    position: vector_zero(),
    speed: vector_zero(),
    previous: vector_zero(),
    cooldown: 0,
};

let gameStateDefault: GameState = {
    area: { x: GAME_INTERNAL_WIDTH, y: GAME_INTERNAL_WIDTH * GAME_RATIO },
    scale: 1,
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
};

@Injectable()
export class GameService {
    public game: Game;
    // constructor() {}

    startGame(server: Server) {
        this.game = new Game(server);
    }

    updateMove1(move1: Move) {
        this.game.updateMove1(move1);
    }

    updateMove2(move1: Move) {
        this.game.updateMove2(move1);
    }
}

class Game {
    server: Server;

    constructor(server: Server) {
        this.server = server;
        let gameState: GameState = gameStateDefault;
        this.resetState(gameState); 
        setInterval(() => {
            gameState = this.updateState(gameState);
        }, 1000 / 60);
    }
    
    updateMove1(newMove1:Move)
    {
        console.log("Move1 received: left:" + newMove1.left + " right: " + newMove1.right);
        move1 = newMove1;
    }

    updateMove2(newMove2:Move)
    {
    console.log("Move2 received: left:" + newMove2.left + " right: " + newMove2.right);
        move2 = newMove2;
    }

    updateGameState(state: GameState) {
        state.scale = state.client_area.x / state.area.x;
    
        state.player1.input = { ...move1 };
        state.player2.input = { ...move2 };
        // this.server.on("Players", (newState: GameState)=> {
        //     state.player1.input = newState.player1.input;
        //     state.player2.input = newState.player2.input;
        // })
        // this.server.on("Player", (newPlayer: Player)=> {
        //     if (newPlayer.side === 0)
        //     {
        //         state.player1.paddle.position = newPlayer.paddle.position;
        //     }
        //     else
        //         state.player2.paddle.position = newPlayer.paddle.position;
        // })
        this.server.on("Move1", (newMove1: Move) => {
            console.log("Move1 received: left:" + newMove1.left + " right: " + newMove1.right);
            move1 = newMove1;
        })
        this.server.on("Move2", (newMove2: Move) => { 
            console.log("Move2 received: left:" + newMove2.left + " right: " + newMove2.right);
            move2 = newMove2;
        })
        if (state.resetCooldown <= 0)
        {
            this.movePlayer(state.player1, state);
            this.movePlayer(state.player2, state);
            this.wallCollision(state.ball, state);
            this.moveBall(state.ball);
        }
        else
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
    
    wallCollision(ball: Ball, state: GameState) {
        if (
            ball.position.x + ballRadius > state.area.x ||
            ball.position.x - ballRadius < 0
        )
            ball.speed.x = -ball.speed.x;
        if (
            this.paddleCollision(ball, state.player1) === 0 &&
            this.paddleCollision(ball, state.player2) === 0
        ) {
            if (ball.position.y > state.area.y - ballRadius) {
                this.resetState(state);
                state.player2.score++;
            } else if (ball.position.y < 0 + ballRadius) {
                this.resetState(state);
                state.player1.score++;
            }
        }
    }
    
    resetState(state: GameState) {
        state.resetCooldown = 60;
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
    
    movePlayer(player: Player, state: GameState) {
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

    updateState(gameState: GameState)
    {
        gameState = this.updateGameState({ ...gameState });
        // console.log("resetCooldown = " + gameState.resetCooldown);
        // console.log("ballPosition = x: " + Math.round(gameState.ball.position.x));
        // console.log("ballPosition = y: " + Math.round(gameState.ball.position.y));

        // console.log("padlePosition = x: " + Math.round(gameState.player1.paddle.position.x));
        // console.log("padlePosition = y: " + Math.round(gameState.player1.paddle.position.y) + "\n");
        this.server.emit("UpdateState", gameState);
        return gameState;
    }
}