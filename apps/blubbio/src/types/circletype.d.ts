declare module 'circletype' {
    class CircleType {
        constructor(element: HTMLElement);
        radius(value: number): CircleType;
        dir(value: number): CircleType;
    }
    export = CircleType;
}
