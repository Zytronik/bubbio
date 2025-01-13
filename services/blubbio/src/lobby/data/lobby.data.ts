const util = require('util');

export interface User {
    clientId: string;
    username: string;
}

export interface Room {
    roomId: string;
    messages: Message[];
    users: User[];
}

export interface Message {
    username: string;
    text: string;
}

export interface Room {
    roomId: string;
    messages: Message[];
    users: User[];
}

export interface ActiveRoomInfo {
    roomId: string;
    userCount: number;
}

export type RoomUserList = User[];

export class LobbyData {
    noRoom: User[] = [];
    inRoom: Room[] = [];

    constructor() { }

    moveUserToNoRoom(clientId: string) {
        for (const room of this["inRoom"]) {
            const userIndex = room.users.findIndex(user => user.clientId === clientId); // Ensure correct path to clientId

            if (userIndex !== -1) {
                // Remove the user from the room
                const removedUser = room.users.splice(userIndex, 1)[0]; // Access the 'user' property

                // Add the user to "noRoom"
                this["noRoom"].push(removedUser); // Ensure correct structure

                // Check if the room is empty and remove it
                if (room.users.length === 0) {
                    this.deleteRoom(room.roomId);
                }
                return this;
            }
        }
        return null;
    }

    deleteRoom(roomId: string): void {
        this["inRoom"] = this["inRoom"].filter(room => room.roomId !== roomId);
    }

    removeUserFromNoRoom(clientIdToRemove: string) {
        this["noRoom"] = this["noRoom"].filter(room => room && room.clientId !== clientIdToRemove);
    }

    getActiveRoomsInfo(): ActiveRoomInfo[] {
        return this.inRoom.map(room => ({
            roomId: room.roomId,
            userCount: room.users.length
        }));
    }

    moveConnectedUserToRoom(clientId: string, roomId: string) {
        // Find the user in "noRoom"
        const userIndex = this["noRoom"].findIndex(user => user.clientId === clientId);

        if (userIndex !== -1) {
            // Remove the user from "noRoom"
            const removedUser = this["noRoom"][userIndex];
            this["noRoom"].splice(userIndex, 1);

            // Add the user to "inRoom"
            if (!this.hasRoom(roomId)) {
                this.setRoom({ roomId: roomId, messages: [], users: [] });
            }

            const room = this.getRoom(roomId);
            if (room) {
                room.users.push(removedUser);
            }
            return this;
        }
        return null;
    }

    setRoom(newRoom: Room): void {
        const roomIndex = this["inRoom"].findIndex(room => room.roomId === newRoom.roomId);

        if (roomIndex !== -1) {
            // Update existing room
            this["inRoom"][roomIndex] = newRoom;
        } else {
            // Add new room
            this["inRoom"].push(newRoom);
        }
    }

    hasRoom(roomId: string): boolean {
        return this["inRoom"].some(room => room.roomId === roomId);
    }

    getRoom(roomId: string): Room | null {
        return this["inRoom"].find(room => room.roomId === roomId) || null;
    }

    getCurrentRoomId(clientId: string): string | null {
        for (const room of this["inRoom"]) {
            const userExists = room.users.some(user => user.clientId === clientId);
            if (userExists) {
                return room.roomId;
            }
        }
        return null;
    }

    deleteEmptyRooms() {
        this["inRoom"] = this["inRoom"].filter(roomData => roomData.users && roomData.users.length > 0);
    }

    getRoomSize(roomId: string): number {
        const room = this.getRoom(roomId);
        return room ? room.users.length : 0;
    }

    getUsername(clientId: string): string | null {
        // Check in noRoom
        let user = this.noRoom.find(user => user.clientId === clientId);
        if (user) {
            return user.username;
        }

        // If not found in noRoom, check in each room in inRoom
        for (const room of this.inRoom) {
            user = room.users.find(user => user.clientId === clientId);
            if (user) {
                return user.username;
            }
        }

        // If not found in any room
        return null;
    }

    removeUserFromAllRooms(clientIdToRemove: string) {
        this["inRoom"] = this["inRoom"].filter(roomData => {
            const userIndex = roomData.users.findIndex(user => user.clientId === clientIdToRemove);

            if (userIndex !== -1) {
                // Remove the user from the room
                roomData.users.splice(userIndex, 1);

                // If the room is now empty, return false so it gets filtered out
                if (roomData.users.length === 0) {
                    return false;
                }
            }

            // Keep the room in the array
            return true;
        });
    }

    checkUserStatus(username: string): 'noRoom' | 'inRoom' | string | 'notFound' {
        // Check in noRoom first
        const isInNoRoom = this.noRoom.some(user => user.username.toLowerCase() === username.toLowerCase());
        if (isInNoRoom) {
            return 'noRoom';
        }

        // Check if the user is in any room
        for (const room of this.inRoom) {
            const userInRoom = room.users.find(user => user.username.toLowerCase() === username.toLowerCase());
            if (userInRoom) {
                return room.roomId; // Return the roomId to indicate the user is inside this specific room
            }
        }

        // If not found in noRoom or any inRoom, the user is not found
        return 'notFound';
    }

    logRoomsInformations(eventMsg: string) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log(util.inspect(this, { showHidden: false, depth: null, colors: true }));
        console.log(`--Event--`);
        console.log(eventMsg);
        console.log(`--Connected Users--`);

        const noRoomUserCount = this["noRoom"].length;
        let inRoomUserCount = 0;
        this["inRoom"].forEach(roomData => {
            inRoomUserCount += roomData.users.length;
        });

        console.log(`Total Users: ${inRoomUserCount + noRoomUserCount}`);
        console.log('--Rooms and Users--');
        if (this["inRoom"].length > 0) {
            this["inRoom"].forEach(roomData => {
                console.log(`Room ID: ${roomData.roomId}`);
                roomData.users.forEach(user => {
                    console.log(`  Username: ${user.username}, Client ID: ${user.clientId}`);
                });
            });
        } else {
            console.log("no rooms");
        }

        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    }
}