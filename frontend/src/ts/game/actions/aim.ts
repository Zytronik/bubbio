import { useGameStore } from "@/stores/gameStore";
import { useUserStore } from "@/stores/userStore";

export function leftDown(): void {
    console.log("alhamdulilah")
    // const localPlayer = useUserStore().getUserName();
    // useGameStore().pressedLeft(localPlayer);
}

export function leftUp(): void {
    console.log("yeaohlmao")
    // const localPlayer = useUserStore().getUserName();
    // useGameStore().releasedLeft(localPlayer);
}

export function rightDown(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().pressedRight(localPlayer);
}

export function rightUp(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().releasedRight(localPlayer);
}

export function toggleAPS(): void {
    const localPlayer = useUserStore().getUserName();
    useGameStore().toggleAPS(localPlayer);
}