import { httpClient } from "../networking/networking.http-client";
import { ModDetail } from '@/ts/page/i/page.i.mod-detail';

export function getFlagImagePath(countryCode: string) {
    if (countryCode) {
        return require(`@/img/countryFlags/${countryCode.toLowerCase()}.svg`);
    }
}

export async function getDifferenceToPB(currentTime: number, mods: ModDetail[]) {
    const pb = await getPersonalBest(mods);
    const pbTime = pb?.gameDuration;

    if (pbTime !== undefined && currentTime !== undefined) {
        return currentTime - pbTime;
    } else {
        return 0;
    }
}

async function getPersonalBest(mods: ModDetail[]) {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        const response =  await httpClient.get("/sprint/personalBest", {
            params: {
                mods: JSON.stringify(mods),
            },
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