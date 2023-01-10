import React, { useState, useEffect } from 'react';
import { Circle, Layer, Rect, Stage, Text } from 'react-konva';
import './App.css';
import  Header  from './components/Header';

export interface Vec2 {
  x: number,
  y: number,
}

export interface Paddle {
  position: Vec2,
  speed: Vec2,
  angle: number,
}

export interface Move {
  left: boolean,
  right: boolean,
}


export interface Player {
  paddle: Paddle,
  input: Move,
  name: string,
  score: number,
  side: number,
}

export interface Ball {
  position: Vec2,
  speed: Vec2,
  previous: Vec2,
  cooldown: number,
}

export interface GameState {
  player1: Player,
  player2: Player,
  ball: Ball,
}


let Window:Vec2 = {x:700, y:1000};
let balldefault: Ball = {position:{x:window.innerWidth / 2 - 10, y:window.innerHeight / 2 - 10}, speed:{x:5, y:1}, previous:{x:window.innerWidth / 2 - 10, y:window.innerHeight / 2 - 10}, cooldown: 0};
let inputdefault: Move = {right: false, left:false};

let move1 : Move = {...inputdefault};
let move2 : Move = {...inputdefault};
let paddleDimensions:Vec2 = {x: 100, y: 10};

let gameWindowBegin:Vec2 = {x:window.innerWidth / 2 - Window.x / 2, y:window.innerHeight / 2 - Window.y / 2};
let gameWindowEnd:Vec2 = {x:window.innerWidth / 2 + Window.x / 2, y:window.innerHeight / 2 + Window.y / 2};


let gameStateDefault: GameState = {
  player1: {
    paddle: {
      position: {
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2 + 445,
      },
      speed: {
        x: 0,
        y: 0,
      },
      angle: 0,
    },
    input: inputdefault,
    name: "Player1",
    score: 0,
    side: 0,
  },
  player2: {
    paddle: {
      position: {
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2 - 455,
      },
      speed: {
        x: 0,
        y: 0,
      },
      angle: 0,
    },
    input: inputdefault,
    name: "Player2",
    score: 0,
    side: 1,
  },
  ball: balldefault,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(gameStateDefault);
  useEffect(() =>
  {
    setInterval(() => {
      updateState(setGameState);
    }, 1000/60);

    document.addEventListener('keydown', function(event)
    {
      keyEvent(event, true);
    })

    document.addEventListener('keyup', function(event)
    {
      keyEvent(event, false);
    })

    // At the end of the component remove the listener using return
    return () => {
      document.removeEventListener('keydown', function(event)
      {
        keyEvent(event, true);
      });
      document.removeEventListener('keyup', function(event)
      {
        keyEvent(event, false);
      });
    }
  }, []);

  return (

    <div style={{backgroundColor: "black"}}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect offsetX={Window.x / 2} offsetY={Window.y / 2} x={window.innerWidth / 2} y={window.innerHeight / 2} width={Window.x} height={Window.y} fill="grey"/>
        </Layer>
        <Layer>
            <Circle
              radius={10}
              x={gameState.ball.position.x}
              y={gameState.ball.position.y}
              fill="white"
            />
            <Rect
              x={gameState.player1.paddle.position.x}
              y={gameState.player1.paddle.position.y}
              fill="white"
              width={paddleDimensions.x} height={paddleDimensions.y}
            />
            <Rect
              x={gameState.player2.paddle.position.x}
              y={gameState.player2.paddle.position.y}
              fill="white"
              width={paddleDimensions.x} height={paddleDimensions.y}
            />
        </Layer>
        <Layer>
          <Text text={gameState.player1.name + " : " + gameState.player1.score} fill={"cyan"} x={window.innerWidth / 2 - 50} y={window.innerHeight / 2 + 550}/>
          <Text text={gameState.player2.name + " : " + gameState.player2.score} fill={"red"} x={window.innerWidth / 2 - 50} y={window.innerHeight / 2 - 550}/>
        </Layer>
      </Stage>
    </div>
  );
}

function updateGameState(state: GameState) {
  state.player1.input = {...move1};
  state.player2.input = {...move2};
  movePlayer(state.player1);
  movePlayer(state.player2);
  wallCollision(state.ball, state);
  moveBall(state.ball);
  return state;
}

function paddleCollision(ball: Ball, player: Player)
{
  if (ball.cooldown === 0)
  {
    if (((ball.previous.y - 10 < player.paddle.position.y - paddleDimensions.y/2 && ball.position.y + 10 > player.paddle.position.y - paddleDimensions.y / 2)
      || (ball.previous.y + 10 > player.paddle.position.y + paddleDimensions.y/2 && ball.position.y - 10 < player.paddle.position.y + paddleDimensions.y / 2))
      && (ball.position.x + 10 > player.paddle.position.x && ball.position.x - 10 < player.paddle.position.x + paddleDimensions.x))
    {
      if (player.side === 0)
      {
        if ((player.input.left && player.input.right && ball.previous.y < player.paddle.position.y)
        || (player.input.left === false && player.input.right === false && ball.previous.y > player.paddle.position.y))
        ball.speed.y = ball.speed.y * (Math.random() * (2 - 1.5) + 1.5);
        else if (player.input.left === false && player.input.right === false && ball.previous.y < player.paddle.position.y)
        ball.speed.y = ball.speed.y * (Math.random() * (1 - 0.8) + 0.8);
      }
      else
      {
        if ((player.input.left && player.input.right && ball.previous.y > player.paddle.position.y)
        || (player.input.left === false && player.input.right === false && ball.previous.y < player.paddle.position.y))
        ball.speed.y = ball.speed.y * (Math.random() * (2 - 1.5) + 1.5);
        else if (player.input.left && player.input.right && ball.previous.y > player.paddle.position.y)
        ball.speed.y = ball.speed.y * (Math.random() * (1 - 0.8) + 0.8);
      }

      if ((ball.previous.y < player.paddle.position.y && ball.speed.y > 0)
        || (ball.previous.y > player.paddle.position.y && ball.speed.y < 0))
      {
        ball.speed.y = -ball.speed.y
        if (ball.speed.y > 0)
          ball.position.y += 5;
        else
          ball.position.y -=5;
      }
      else
      {
        if (ball.speed.y > 0)
          ball.position.y += 5;
        else
          ball.position.y -=5;
      }
      ball.cooldown = 20;
      return 1;
    }
  }
  return 0;
}

function wallCollision(ball: Ball, state: GameState)
{
  if (ball.position.x + 10 > gameWindowEnd.x || ball.position.x - 10 < gameWindowBegin.x)
    ball.speed.x = -ball.speed.x;
  if (paddleCollision(ball, state.player1) === 0 && paddleCollision(ball, state.player2) === 0)
  {
    if (ball.position.y > gameWindowEnd.y - 10) {
      resetState(state);
      state.player2.score++;
    } else if (ball.position.y < gameWindowBegin.y + 10) {
      resetState(state);
      state.player1.score++;
    }
  }
}

function resetState(state: GameState) {
  state.player1.paddle.position.x = window.innerWidth / 2 - paddleDimensions.x / 2;
  state.player1.paddle.position.y = window.innerHeight / 2 + 495 - paddleDimensions.x / 2;
  state.player2.paddle.position.x = window.innerWidth / 2 - paddleDimensions.x / 2;
  state.player2.paddle.position.y = window.innerHeight / 2 - 495 + paddleDimensions.x / 2;
  state.ball.position.x = window.innerWidth / 2 - paddleDimensions.y;
  state.ball.position.y = window.innerHeight / 2 - paddleDimensions.y;
  state.ball.speed.x = (Math.random() * (-6));
  if (state.player1.score > state.player2.score)
    state.ball.speed.y = (Math.random() * (5 - 1.5) + 1.5);
  else
    state.ball.speed.y = -(Math.random() * (5 - 1.5) + 1.5);
}

function moveBall(ball: Ball)
{
  ball.previous.x = ball.position.x;
  ball.previous.y = ball.position.y;
  if (ball.speed.y > 12)
    ball.speed.y = 12;
  else if (ball.speed.y < -12)
    ball.speed.y = -12;
  else if (ball.speed.y < 4 && ball.speed.y > 0)
    ball.speed.y = 4;
  else if (ball.speed.y > -4 && ball.speed.y < 0)
    ball.speed.y = -4
  if (ball.speed.x > 15)
    ball.speed.x = 15;
  else if (ball.speed.x < -15)
    ball.speed.x = -15;
  else if (ball.speed.x < 4 && ball.speed.x > 0)
    ball.speed.x = 4;
  else if (ball.speed.x > -4 && ball.speed.x < 0)
    ball.speed.x = -4
  ball.position.x += ball.speed.x;
  ball.position.y += ball.speed.y  ;
  if (ball.cooldown > 0)
    ball.cooldown--;
}

function movePlayer(player: Player) {
  player.paddle.speed = {x:0, y:0};
  if (player.side === 0)
  {
    if (player.input.left && player.input.right)
      player.paddle.speed.y = -4;
    else if (player.input.left && player.paddle.position.x > gameWindowBegin.x)
      player.paddle.speed.x = -8;
    else if (player.input.right && player.paddle.position.x < gameWindowEnd.x - paddleDimensions.x)
      player.paddle.speed.x = 8;
    else if (player.paddle.position.y + paddleDimensions.y < gameWindowEnd.y)
      player.paddle.speed.y = 2;
  }
  else
  {
    if (player.input.left && player.input.right)
      player.paddle.speed.y = 4;
    else if (player.input.left && player.paddle.position.x > gameWindowBegin.x)
      player.paddle.speed.x = -8;
    else if (player.input.right && player.paddle.position.x < gameWindowEnd.x - paddleDimensions.x)
      player.paddle.speed.x = 8;
    else if (player.paddle.position.y > gameWindowBegin.y)
      player.paddle.speed.y = -2;
  }

  player.paddle.position.x += player.paddle.speed.x;
  player.paddle.position.y += player.paddle.speed.y;
}

function keyEvent(key: KeyboardEvent, keyState: boolean)
{
  if (key.key === "ArrowLeft" && keyState) //move left
  {
    move1.left = true;
  } else if (key.key === "ArrowLeft") //move left
  {
    move1.left = false;
  } 
  else if (key.key === "ArrowRight" && keyState) //move left
  {
    move1.right = true;
  } else if (key.key === "ArrowRight") //move left
  {
    move1.right = false;
  }

  if ((key.key === "A" || key.key === "a") && keyState) //move left
  {
    move2.left = true;
  } else if (key.key === "A" || key.key === "a") //move left
  {
    move2.left = false;
  } 
  else if ((key.key === "D" || key.key === "d") && keyState) //move left
  {
    move2.right = true;
  } else if (key.key === "D" || key.key === "d") //move left
  {
    move2.right = false;
  }
}

function updateState(setGameState: Function) {
  setGameState((prev: GameState) => {
    return updateGameState({...prev});
  })
}

export default App;
