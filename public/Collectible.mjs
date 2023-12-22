class Collectible {
  constructor({id, x = 0, y = 0, width = 0, height = 0, picture = '', value = 0}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.picture = picture;
    this.value = value;
  }

}

try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
