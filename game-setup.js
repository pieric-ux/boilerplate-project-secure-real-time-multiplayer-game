const gameSetup = {
  
  SETUP: {
    CANVAS: {
      WIDTH: 640,
      HEIGHT: 480,
      HEADER: 45,
      PADDING: 5,
      PRIMARY_COLOR: 'black',
      SECONDARY_COLOR: 'white',
      FONT: 'serif',
      FONT_SIZE_CONTROLS: 20,
      FONT_SIZE_TITLE: 23,
      FONT_SIZE_RANKING: 18,
      FONT_SIZE_ENDGAME: 25,
      PRELOAD_IMAGES: {
        PLAYERS_AVATAR: {
          MAIN_PLAYER: '',
          OTHER_PLAYER: ''
        },
        COLLECTIBLES_IMAGE: {
          GOLD_COIN: '',
          SILVER_COIN: '',
          BRONZE_COIN: ''
        }
      }
    },
    GAME: {
      SPEED: 330,
      END_SCORE: 30
    },
    PLAYERS: {
      WIDTH: 30,
      HEIGHT: 30,
      MAIN_PLAYER : {
        AVATAR: 'https://cdn.freecodecamp.org/demo-projects/images/main-player.png'
      },
      OTHER_PLAYER: {
        AVATAR: 'https://cdn.freecodecamp.org/demo-projects/images/other-player.png'
      }
    },
    COLLECTIBLES: {
      WIDTH: 15,
      HEIGHT: 15,
      TYPES: {
        GOLD_COIN: {
          PICTURE: 'https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png',
          VALUE: 5
        },
        SILVER_COIN: {
          PICTURE: 'https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png',
          VALUE: 3
        },
        BRONZE_COIN: {
          PICTURE: 'https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png',
          VALUE: 1
        }
      }
    }
  }
}

gameSetup.SETUP.CANVAS.PRELOAD_IMAGES.PLAYERS_AVATAR.MAIN_PLAYER = gameSetup.SETUP.PLAYERS.MAIN_PLAYER.AVATAR;
gameSetup.SETUP.CANVAS.PRELOAD_IMAGES.PLAYERS_AVATAR.OTHER_PLAYER = gameSetup.SETUP.PLAYERS.OTHER_PLAYER.AVATAR;

gameSetup.SETUP.CANVAS.PRELOAD_IMAGES.COLLECTIBLES_IMAGE.GOLD_COIN = gameSetup.SETUP.COLLECTIBLES.TYPES.GOLD_COIN.PICTURE;
gameSetup.SETUP.CANVAS.PRELOAD_IMAGES.COLLECTIBLES_IMAGE.SILVER_COIN = gameSetup.SETUP.COLLECTIBLES.TYPES.SILVER_COIN.PICTURE;
gameSetup.SETUP.CANVAS.PRELOAD_IMAGES.COLLECTIBLES_IMAGE.BRONZE_COIN = gameSetup.SETUP.COLLECTIBLES.TYPES.BRONZE_COIN.PICTURE;
  
module.exports = gameSetup;