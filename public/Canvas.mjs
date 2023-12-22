class Canvas {

  constructor(setup) {
    this.canvas = document.getElementById('game-window');
    this.canvas.width = setup.WIDTH;
    this.canvas.height = setup.HEIGHT;
    this.canvas.header = setup.HEADER;
    this.canvas.padding = setup.PADDING;
    this.ctx = this.canvas.getContext('2d');

    this.gameBoard = {
      minX: this.canvas.padding,
      minY: this.canvas.header,
      width: this.canvas.width - (2 * this.canvas.padding),
      height: this.canvas.height - this.canvas.header - this.canvas.padding
    };

    this.preloadedImages = {};
    this.preloadImages(setup.PRELOAD_IMAGES);

    this.PRIMARY_COLOR = setup.PRIMARY_COLOR;
    this.SECONDARY_COLOR = setup.SECONDARY_COLOR;
    this.FONT = setup.FONT;
    this.FONT_SIZE_CONTROLS = setup.FONT_SIZE_CONTROLS;
    this.FONT_SIZE_TITLE = setup.FONT_SIZE_TITLE;
    this.FONT_SIZE_RANKING = setup.FONT_SIZE_RANKING;
    this.FONT_SIZE_ENDGAME = setup.FONT_SIZE_ENDGAME;
  }

  preloadImages(images) {
    for (const category in images) {
      for (const key in images[category]) {
        const url = images[category][key];
        this.preloadedImages[url] = new Image();
        this.preloadedImages[url].src = url;
      }
    }
  }

  drawCanvas() {
    this.ctx.fillStyle = this.PRIMARY_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawHeader();
    this.drawGameBoard();
  }

  drawHeader() {
    this.ctx.fillStyle = this.SECONDARY_COLOR;
    this.drawControls();
    this.drawTitle();
  }

  drawControls() {
    const text = 'Controls: WASD';
    this.ctx.font = `${this.FONT_SIZE_CONTROLS}px ${this.FONT}`;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(text, this.canvas.padding, (this.canvas.header / 2) + (this.FONT_SIZE_CONTROLS / 2));
  }

  drawTitle() {
    const text = 'Coin Race';
    this.ctx.font = `${this.FONT_SIZE_TITLE}px ${this.FONT}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, (this.canvas.header / 2) + (this.FONT_SIZE_TITLE / 2));
  }

  drawGameBoard() {
    this.ctx.strokeStyle = this.SECONDARY_COLOR;
    this.ctx.strokeRect(
      this.gameBoard.minX,
      this.gameBoard.minY,
      this.gameBoard.width,
      this.gameBoard.height
    );
  }

  drawRanking(currentRanking = 1, totalPlayers = 1) {
    let text = `Rank ${currentRanking} / ${totalPlayers}`;
    this.ctx.font = `${this.FONT_SIZE_RANKING}px ${this.FONT}`;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(text, this.canvas.width - this.canvas.padding, (this.canvas.header / 2) + (this.FONT_SIZE_RANKING / 2));
  }

  drawEndGame(winner) {
    let result;
    if (winner) {
      result = 'win';
    } else {
      result = 'lose';
    }
    const text = `You ${result}! Restart and try again.`
    this.ctx.font = `${this.FONT_SIZE_ENDGAME}px ${this.FONT}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.header * 2);
  }
  /*
  clearAllPlayers(players) {
    players.forEach(player => this.clearPlayer(player));
  }

  clearPlayer(player) {
    this.ctx.fillStyle = this.PRIMARY_COLOR;
    this.ctx.fillRect(player.x, player.y, player.width, player.height);
  }
*/
  drawAllPlayers(players) {
    players.forEach(player => this.drawPlayer(player));
  }

  drawPlayer(player) {
    const playerAvatar = this.preloadedImages[player.avatar];
    this.ctx.drawImage(playerAvatar, player.x, player.y);
  }
  /*
  clearAllCollectibles(collectibles) {
    collectibles.forEach(collectible => this.clearCollectible(collectible));
  }
  
  clearCollectible(collectible) {
    this.ctx.fillStyle = this.PRIMARY_COLOR;
    this.ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
  }
  */
  drawAllCollectibles(collectibles) {
    collectibles.forEach(collectible => this.drawCollectible(collectible));
  }
  
  drawCollectible(collectible) {
    const collectiblePicture = this.preloadedImages[collectible.picture];
    this.ctx.drawImage(collectiblePicture, collectible.x, collectible.y);
  }
   
}

export default Canvas;