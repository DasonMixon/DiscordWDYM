class PlayerSubmission {
    playerId: string;
    playerName: string;
    caption: string;

    constructor(playerId: string, playerName: string, caption: string) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.caption = caption;
    }
}

export default PlayerSubmission;