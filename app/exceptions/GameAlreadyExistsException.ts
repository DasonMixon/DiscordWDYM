class GameAlreadyExistsException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, GameAlreadyExistsException.prototype);
        this.name = GameAlreadyExistsException.name;
    }
}

export default GameAlreadyExistsException;