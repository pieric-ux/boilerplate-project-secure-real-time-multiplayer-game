require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const cors = require("cors");
const helmet = require("helmet");
const nocache = require("nocache");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('etag', false);
  next();
});

app.use(nocache());

app.use(
  helmet({
    hidePoweredBy: {
      setTo: "PHP 7.4.3",
    },
  }),
);


app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// Socket.io events
const gameSetup = require("./game-setup.js");
const Player = require("./public/Player.mjs");
const Collectible = require("./public/Collectible.mjs");
const namespace = "/game";
const game = io.of(namespace);

let players = [];
let collectible;
let collectibles = [];
let collectibleId = 0;

const gameBoard = {
  minX: gameSetup.SETUP.CANVAS.PADDING,
  minY: gameSetup.SETUP.CANVAS.HEADER,
  width: gameSetup.SETUP.CANVAS.WIDTH - 2 * gameSetup.SETUP.CANVAS.PADDING,
  height:
    gameSetup.SETUP.CANVAS.HEIGHT -
    gameSetup.SETUP.CANVAS.HEADER -
    gameSetup.SETUP.CANVAS.PADDING,
};

const generateRandomPosition = (item) => {
  let itemWidth, itemHeight;

  if (item === "player") {
    itemWidth = gameSetup.SETUP.PLAYERS.WIDTH;
    itemHeight = gameSetup.SETUP.PLAYERS.HEIGHT;
  } else if (item === "collectible") {
    itemWidth = gameSetup.SETUP.COLLECTIBLES.WIDTH;
    itemHeight = gameSetup.SETUP.COLLECTIBLES.HEIGHT;
  }

  const minX = gameBoard.minX;
  const minY = gameBoard.minY;
  const maxX = gameBoard.width - itemWidth;
  const maxY = gameBoard.height - itemHeight;

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  return { x: randomX, y: randomY };
};

const generateRandomCollectible = () => {
  const { x, y } = generateRandomPosition("collectible");
  const types = Object.values(gameSetup.SETUP.COLLECTIBLES.TYPES);
  const randomType = types[Math.floor(Math.random() * types.length)];

  return new Collectible({
    id: ++collectibleId,
    x: x,
    y: y,
    width: gameSetup.SETUP.COLLECTIBLES.WIDTH,
    height: gameSetup.SETUP.COLLECTIBLES.HEIGHT,
    picture: randomType.PICTURE,
    value: randomType.VALUE,
  });
};

const generateCollectible = () => {
  if (collectibles.length == 0) {
    collectible = generateRandomCollectible();
    collectibles = [...collectibles, collectible];
  } else {
    collectible = collectibles[collectibles.length - 1];
  }
  game.emit("collectible-spawned", { collectible });
};

const createPlayer = (socket) => {
  const { x, y } = generateRandomPosition("player");
  return new Player({
    id: socket.id,
    x: x,
    y: y,
    width: gameSetup.SETUP.PLAYERS.WIDTH,
    height: gameSetup.SETUP.PLAYERS.HEIGHT,
  });
}

const handlePlayerUpdate = (socket, player) => {
  player.avatar = "";
  if (player.score >= gameSetup.SETUP.GAME.END_SCORE) {
    socket.emit("you-win");
    socket.broadcast.emit("you-lose");
    const socketsInNamespace = io.of(namespace).sockets;
    players = [];
    collectibles = [];
    collectibleId = 0;
    Object.keys(socketsInNamespace).forEach((socketId) => {
      const socket = socketsInNamespace[socketId];
      socket.disconnect(true);
    });
  } else {
    const playerIndex = players.findIndex((p) => p.id === player.id);
    players[playerIndex] = player;
    socket.broadcast.emit("player-updated", { player });
  }
}

const handleCollectibleCollision = (socket, collectible) => {
  socket.broadcast.emit("collectible-collision", { collectible });
  collectibles = collectibles.filter((c) => c.id !== collectible.id);
  generateCollectible();
}

const handlePlayerDisconnect = (socket) => {
  socket.broadcast.emit("player-disconnected", socket.id);
  players = players.filter((player) => player.id !== socket.id);
}

game.on("connection", (socket) => {

  socket.emit("game-setup", { gameSetup });

  const player = createPlayer(socket);
  socket.emit("player-connected", { player, players });
  players = [...players, player];

  generateCollectible();

  socket.on("player-updated", ({ player }) => {
    handlePlayerUpdate(socket, player);
  });

  socket.on("collectible-collision", ({ collectible }) => {
    handleCollectibleCollision(socket, collectible);
  });

  socket.on("disconnect", (reason) => {
    handlePlayerDisconnect(socket);
  });
});

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env["PORT"] || 3000;

// Set up server and tests
const server = httpServer.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env["NODE_ENV"] === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
