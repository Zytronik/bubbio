const util = require('util')

let lobbyData = {
    "noRoom": [],
    "inRoom": new Map(),
};

function setup(io) {
    io.on('connection', (socket) => {
        //register new user
        lobbyData["noRoom"].push({
            user: {
                socketId: socket.id,
                username: 'User-' + Math.random().toString(36).substring(5),
            }
        });

        const username = getUsername(socket.id);

        logRoomsInformations('User connected');

        socket.on('joinRoom', (data) => {
            // Create the room if it doesn't exist
            if (!lobbyData["inRoom"].has(data.roomId)) {
                lobbyData["inRoom"].set(data.roomId, { messages: [], users: [] });
            }
            socket.join(data.roomId); //join socket
            io.to(data.roomId).emit('message', { user: 'Server', text: `${username} joined the room: ${data.roomId}` }); //send User joined msg to room
            lobbyData["inRoom"].get(data.roomId).messages.push({ user: 'Server', text: `${username} joined the room: ${data.roomId}` }); //save User joined msg in lobbyData obj
            moveConnectedUserToRoom(socket.id, data.roomId); //move User to Room in lobbyData Obj
            //io.to(data.roomId).emit('joinRoom', { users: rooms.get(data.roomId).users }); // send list of Users to room
            logRoomsInformations('User joined a room');
        });

        socket.on('message', (data) => {
            const roomId = getCurrentRoom(socket.id);
            io.to(roomId).emit('message', { user: username, text: data.text }); // send message to room
            lobbyData["inRoom"].get(roomId).messages.push({ user: username, text: data.text }); //save message in lobbyData obj
            logRoomsInformations("Messages was send");
        });

        socket.on('leaveRoom', () => {
            const roomId = getCurrentRoom(socket.id);
            if (roomId) { // if is in a room
                socket.leave(roomId); // leave room
                io.to(roomId).emit('message', { user: 'Server', text: `${username} left the room: ${roomId}` }); // send leave msg to room
                lobbyData["inRoom"].get(roomId).messages.push({ user: 'Server', text: `${username} left the room: ${roomId}` }); // save leave msg in lobbyData obj
                moveUserToNoRoom(socket.id); //move user to no room lobbyData obj
                logRoomsInformations('User left a room');
            } else {
                console.log(`${data.user} is trying to leave a room without being in one`);
            }
        });

        socket.on('disconnecting', () => {
            const roomId = getCurrentRoom(socket.id);
            if (roomId) {
                io.to(roomId).emit('message', { user: 'Server', text: `${username} left the room: ${roomId}` }); // send leave msg to room
                lobbyData["inRoom"].get(roomId).messages.push({ user: 'Server', text: `${username} left the room: ${roomId}` }); // save leave msg in room obj
            }
            removeUserFromAllRooms(socket.id); // remove User from lobbyData Obj
            deleteEmptyRooms(); //delete Empty rooms
            removeUserFromNoRoom(socket.id); //remove User from lobbyData Obj if he is in no room
            logRoomsInformations('User disconnected');
        });

        function moveConnectedUserToRoom(socketId, roomId) {
            // Find the user in "noRoom"
            const roomIndex = lobbyData["noRoom"].findIndex(room => room.user && room.user.socketId === socketId);

            if (roomIndex !== -1) {
                // Remove the user from "noRoom"
                const removedUser = lobbyData["noRoom"][roomIndex].user;
                lobbyData["noRoom"].splice(roomIndex, 1);

                // Add the user to "inRoom"
                if (!lobbyData["inRoom"].has(roomId)) {
                    lobbyData["inRoom"].set(roomId, { messages: [], users: [] });
                }

                lobbyData["inRoom"].get(roomId).users.push({ user: removedUser });
                return lobbyData;
            }
            return null;
        }

        function getCurrentRoom(socketId) {
            for (const [roomId, roomData] of lobbyData["inRoom"].entries()) {
                if (roomData.users && roomData.users.some(user => user.user.socketId === socketId)) {
                    return roomId;
                }
            }
            return null;
        }

        function moveUserToNoRoom(socketId) {
            for (const [roomId, roomData] of lobbyData["inRoom"].entries()) {
                const userIndex = roomData.users.findIndex(user => user.user.socketId === socketId);
        
                if (userIndex !== -1) {
                    // Remove the user from the room
                    const removedUser = roomData.users.splice(userIndex, 1)[0];
        
                    // Add the user to "noRoom"
                    lobbyData["noRoom"].push({
                        user: {
                            socketId: socketId,
                            username: removedUser.user.username,
                        },
                    });
        
                    // Optionally, you can check if the room is empty and remove it
                    if (roomData.users.length === 0) {
                        lobbyData["inRoom"].delete(roomId);
                    }
                    return lobbyData;
                }
            }
            return null;
        }

        function removeUserFromAllRooms(socketIdToRemove) {
            lobbyData["inRoom"].forEach((roomData, roomId) => {
                if (roomData.users && roomData.users.some(user => user.user.socketId === socketIdToRemove)) {
                    roomData.users = roomData.users.filter(user => user.user.socketId !== socketIdToRemove);
                    if (roomData.users.length === 0) {
                        lobbyData["inRoom"].delete(roomId);
                    }
                }
            });
        }

        function removeUserFromNoRoom(socketIdToRemove) {
            lobbyData["noRoom"] = lobbyData["noRoom"].filter(room => room.user && room.user.socketId !== socketIdToRemove);
        }

        function getUsername(socketId) {
            const roomWithUser = lobbyData["noRoom"].find((room) => room.user.socketId === socketId);
            return roomWithUser ? roomWithUser.user.username : null;
        }

        function deleteEmptyRooms() {
            lobbyData["inRoom"].forEach((roomData, roomId) => {
                if (roomData.users && roomData.users.length === 0) {
                    lobbyData["inRoom"].delete(roomId);
                }
            });
        }

        function logRoomsInformations(eventMsg) {
            //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            //console.log(util.inspect(lobbyData, { showHidden: false, depth: null, colors: true }));
           /* console.log(`--Event--`);
            console.log(eventMsg);
            console.log(`--Connected Users--`);
            const noRoomUserCount = lobbyData["noRoom"].length;
            let inRoomUserCount = 0;
            lobbyData["inRoom"].forEach(roomData => {
                inRoomUserCount += roomData.users.length;
            });
            console.log(`Total Users: ${inRoomUserCount + noRoomUserCount}`);
            console.log('--Rooms and Users--');
            if (lobbyData["inRoom"].size > 0) {
                lobbyData["inRoom"].forEach((roomData, roomId) => {
                    console.log(`Room ID: ${roomId}`);
                    roomData.users.forEach(user => {
                        console.log(`  Username: ${user.user.username}, Socket ID: ${user.user.socketId}`);
                    });
                });
            } else {
                console.log("no rooms");
            }
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");*/
        }

    });
}

module.exports = {
    setup: setup,
};