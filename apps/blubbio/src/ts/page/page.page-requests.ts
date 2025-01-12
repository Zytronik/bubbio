import state from "../networking/networking.client-websocket";
import { httpClient } from "../networking/networking.http-client";

export function getFlagImagePath(countryCode: string) {
    if (countryCode) {
        return require(`@/img/countryFlags/${countryCode.toLowerCase()}.svg`);
    }
}

export async function getSprintDifferenceToPB(currentTimeFloat: number) {
    const currentTime = Math.floor(currentTimeFloat);
    const pb = await getSprintPersonalBest();
    const pbTime = pb?.gameDuration;

    if (pbTime !== undefined && currentTime !== undefined) {
        return currentTime - pbTime;
    } else {
        return 0;
    }
}

async function getSprintPersonalBest() {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response =  await httpClient.get("/sprint/personalBest", {
            headers: headers
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch personal Best: ", error);
        return undefined;
    }
}

export async function getFriends() {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response =  await httpClient.get("/friends", {
            headers: headers
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch personal Best: ", error);
        return undefined;
    }
}

export function getUserOnlineStatus(username: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
        if (state.socket) {
            state.socket.on('getUserOnlineStatus', (status) => {
                resolve(status);
                if (state.socket) {
                    state.socket.off('getUserOnlineStatus');
                }
            });

            state.socket.emit('getUserOnlineStatus', username);

            setTimeout(() => {
                reject(new Error("Timeout: Failed to get user online status"));
                if (state.socket) {
                    state.socket.off('getUserOnlineStatus');
                }
            }, 5000);
        } else {
            reject(new Error("Socket is not available"));
        }
    });
}

export async function getSprintRecord(id: string) {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response = await httpClient.get(`/sprint/record/${id}`, {
            headers: headers
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch sprint records: ", error);
        return undefined;
    }
}

export async function getWerkschauLeaderboard() {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response = await httpClient.get("/sprint/werkschauLeaderboard", {
            headers: headers
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch werkschau leaderboard: ", error);
        return undefined;
    }
}

