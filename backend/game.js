const POSSIBLE_COLORS = [0, 1, 2, 3, 4, 5, 6];
let bubbleQueue = genereateBubbleQueue(100);

function genereateBubbleQueue(queueLength) {
    let resultQueue = "";
    for (let i = 0; i < queueLength; i++) {
        resultQueue += POSSIBLE_COLORS[Math.random(POSSIBLE_COLORS.length)];
    }
    /* console.log(resultQueue); */
    return resultQueue;
}

function setup(io) {
    io.on('connection', (socket) => {
        socket.emit('generateQueue', { queue: "test123" });

        socket.on('testma', (data) => {
            console.log(data);
            socket.emit("testma", { th: "hello" });
        });
    });
}

module.exports = {
    setup: setup,
};

/*
queue
current piece
hold piece
board
arrow angle
current combo
*/
