const lobby = require("./lobby.js");
const websocket = require("./websocket.js");
const game = require("./game.js");
const loginPage = require("./login.js");
const db = require("./db.js");

db.setup();
lobby.setup(websocket.io);
game.setup(websocket.io);
loginPage.setup(websocket.io);
