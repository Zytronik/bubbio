export enum GAME_MODE {
    NONE = 'NONE',
    SPRINT_R1 = '(Floating bubbles clear) && (prefilled board)',
    SPRINT_R2 = '!(Floating bubbles clear) && (prefilled board)',
    SPRINT_R3 = '(Floating bubbles clear) && !(prefilled board)',
    SPRINT_R4 = '!(Floating bubbles clear) && !(prefilled board)',
}

export const SprintAmountMap: Map<GAME_MODE, number> = new Map([
    [GAME_MODE.SPRINT_R1, 200],
    [GAME_MODE.SPRINT_R2, 200],
    [GAME_MODE.SPRINT_R3, 100],
    [GAME_MODE.SPRINT_R4, 100],
]);