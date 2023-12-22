class Player {
  constructor({id, x = 0, y = 0, width = 0, height = 0, avatar = '', rank = 1, score = 0}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.avatar = avatar;
    this.rank = rank;
    this.score = score;
    this.win = false;
    this.direction = {
      up: false,
      down: false,
      right: false,
      left: false
    };
  }

  movePlayer(dir, speed, deltaTime, canvas) {
    const distance = speed * deltaTime;
    
    if(dir.up) {
      this.y = Math.max(this.y - distance, canvas.gameBoard.minY);
    }
    if(dir.down) {
      this.y = Math.min(this.y + distance, (canvas.gameBoard.minY + canvas.gameBoard.height - this.height));
    };
    if(dir.right) {
      this.x = Math.min(this.x + distance, (canvas.gameBoard.minX + canvas.gameBoard.width - this.width));
    };
    if(dir.left) {
      this.x = Math.max(this.x - distance, canvas.gameBoard.minX);
    };
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  calculateRank(arr) {
    const sortedArr = [...arr].sort((a, b) => b.score - a.score);

    sortedArr.forEach((player, index) => {
      player.rank = index + 1;
    });
  }

}

try {
  module.exports = Player;
} catch(e) {}

export default Player;
