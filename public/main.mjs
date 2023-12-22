import Game from './Game.mjs';
import Canvas from './Canvas.mjs';

const socket = io('/game');

socket.on('game-setup', ({ gameSetup }) => {
  const canvas = new Canvas(gameSetup.SETUP.CANVAS);
  const game = new Game(socket, canvas, gameSetup.SETUP);
});