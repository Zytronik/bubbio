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