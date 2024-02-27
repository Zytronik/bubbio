//TODO Remove min max from frontend and load from backend
export interface NumberSetting {
    name: string,
    description: string,
    value: number,
    defaultValue: number,
    min: number,
    max: number,
}