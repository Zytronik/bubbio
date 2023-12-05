function setup(io){
    io.on('connection', (socket) => {
        setInterval(() => {
            console.log("test");
            socket.emit('generateQueue', { queue: "test123" });
        }, 2000);
    });
}

module.exports = {
    setup: setup,
};