export class InputReader {
    private leftPressed = false;
    private rightPressed = false;
    private shootPressed = false;


    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.code === "ArrowLeft") {
            this.leftPressed = true;
        } else if (event.code === "ArrowRight") {
            this.rightPressed = true;
        } else if (event.code === "Space" && !this.shootPressed) {
            this.shootPressed = true;
            // Call your shoot function here
            this.shoot();
        }
    }

    private handleKeyUp(event: KeyboardEvent) {
        if (event.code === "ArrowLeft") {
            this.leftPressed = false;
        } else if (event.code === "ArrowRight") {
            this.rightPressed = false;
        } else if (event.code === "Space") {
            this.shootPressed = false;
        }
    }

    private shoot() {
        // Implement your shooting logic here
        console.log("Bang! Shooting...");
    }
}
