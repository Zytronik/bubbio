const lobby = require("./lobby.js");
const websocket = require("./websocket.js");
const game = require("./game.js");

lobby.setup(websocket.io);
game.setup(websocket.io);
