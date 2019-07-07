class GameNotFoundException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, GameNotFoundException.prototype);
        this.name = GameNotFoundException.name;
    }
}

export default GameNotFoundException;