import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

class Game {
  constructor(socket, canvas, setup) {
    this.socket = socket;
    this.canvas = canvas;
    this.speed = setup.GAME.SPEED;
    this.avatarMainPlayer = setup.PLAYERS.MAIN_PLAYER.AVATAR;
    this.avatarOtherPlayer = setup.PLAYERS.OTHER_PLAYER.AVATAR;
    this.players = [];
    this.collectibles = [];
    this.endGame = false;
    this.setupSocketHandlers();
    this.setupKeyboardListeners();
    this.lastUpdateTime = performance.now();
    this.tick = null;
  }

  startGameLoop() {
    const gameLoop = () => {
      
      cancelAnimationFrame(this.tick);
      
      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / 1000;

      this.update(deltaTime);
      this.draw();

      this.lastUpdateTime = currentTime;

      if (!this.endGame) {
        this.tick = requestAnimationFrame(gameLoop);
      } else {
        this.canvas.drawEndGame(this.mainPlayer.win);
      }
    };

    gameLoop();
  }

  draw() {
    this.canvas.drawCanvas();
    this.canvas.drawRanking(this.mainPlayer.rank, this.players.length);
    this.canvas.drawAllPlayers(this.players);
    this.canvas.drawAllCollectibles(this.collectibles);
  }

  update(deltaTime) {
    this.mainPlayer.movePlayer(this.mainPlayer.direction, this.speed, deltaTime, this.canvas);
    
    this.mainPlayer.calculateRank(this.players);
    
    this.collectibles.forEach((collectible) => {
      if (this.mainPlayer.collision(collectible)) {
        this.emitCollectibleCollision(collectible);
        this.removeCollectibleToArray(collectible.id);
        this.mainPlayer.score += collectible.value;
      }
    });
    
    this.emitPlayerUpdated(this.mainPlayer);
  }

  addPlayerToArray(player) {
    this.players = [...this.players, player];
  }

  updatePlayerToArray(player) {
    const playerIndex = this.players.findIndex(p => p.id === player.id);
    this.players[playerIndex] = player;
  }

  removePlayerToArray(playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
  }

  addCollectibleToArray(collectible) {
    this.collectibles = [...this.collectibles, collectible];
  }

  removeCollectibleToArray(collectibleId) {
    this.collectibles = this.collectibles.filter(collectible => collectible.id !== collectibleId);
  }

  createMainPlayer(player) {
    const mainPlayer = new Player(player);
    mainPlayer.avatar = this.avatarMainPlayer;

    this.mainPlayer = mainPlayer;
    
    this.addPlayerToArray(mainPlayer);
    this.emitPlayerUpdated(mainPlayer);
  }

  createOrUpdateOtherPlayer(player) {
    const playerExist = this.players.some(p => p.id === player.id);

    const otherPlayer = new Player(player);
    otherPlayer.avatar = this.avatarOtherPlayer;
    
    if(!playerExist) {
      this.addPlayerToArray(otherPlayer);
    } else {
      this.updatePlayerToArray(otherPlayer);
    }
  }

  createCollectible(collectible) {
    const newCollectible = new Collectible(collectible);
    this.addCollectibleToArray(newCollectible);
  }

  emitPlayerUpdated(player) {
    this.socket.emit('player-updated', { player });
  }

  emitCollectibleCollision(collectible) {
    this.canvas.drawRanking(1, 3);
    this.socket.emit('collectible-collision', { collectible });
  }
  
  handlePlayerConnected({ player, players }) {
    this.createMainPlayer(player);

    players.forEach(player => {
      this.createOrUpdateOtherPlayer(player);
    });
    this.startGameLoop();
  }

  handlePlayerUpdated({ player }) {
    this.createOrUpdateOtherPlayer(player);
  }

  handlePlayerDisconnected(playerId) {
    this.removePlayerToArray(playerId);
  }

  handleCollectibleSpawned({ collectible }) {
    this.createCollectible(collectible);
  }

  handleCollectibleCollision({ collectible }) {
    this.removeCollectibleToArray(collectible.id);
  }

  handleYouWin() {
    this.mainPlayer.win = true;
    this.endGame = true;
  }

  handleYouLose() {
    this.endGame = true;
  }

  handleKeyDown(event) {
    if(event.key === 'ArrowUp' || event.key === 'w') {
      this.mainPlayer.direction['up'] = true;
    } 
    if (event.key === 'ArrowDown' || event.key === 's') {
      this.mainPlayer.direction['down'] = true;
    } 
    if (event.key === 'ArrowRight' || event.key === 'd') {
      this.mainPlayer.direction['right'] = true;
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.mainPlayer.direction['left'] = true;
    }
  }

  handleKeyUp(event) {
    if(event.key === 'ArrowUp' || event.key === 'w') {
      this.mainPlayer.direction['up'] = false;
    } 
    if (event.key === 'ArrowDown' || event.key === 's') {
      this.mainPlayer.direction['down'] = false;
    } 
    if (event.key === 'ArrowRight' || event.key === 'd') {
      this.mainPlayer.direction['right'] = false;
    }
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.mainPlayer.direction['left'] = false;
    }
  }

  setupSocketHandlers() {
    this.socket.on('player-connected', ({ player, players }) => this.handlePlayerConnected({ player, players }));
    this.socket.on('player-updated', ({ player }) => this.handlePlayerUpdated({ player }));
    this.socket.on('player-disconnected', (playerId) => this.handlePlayerDisconnected(playerId));

    this.socket.on('collectible-spawned', ({ collectible}) => this.handleCollectibleSpawned({ collectible }));
    this.socket.on('collectible-collision', ({ collectible }) => this.handleCollectibleCollision({ collectible }));

    this.socket.on('you-win' , () => this.handleYouWin());
    this.socket.on('you-lose', () => this.handleYouLose());
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', event => this.handleKeyDown(event));
    window.addEventListener('keyup', event => this.handleKeyUp(event));
  }

}

export default Game;