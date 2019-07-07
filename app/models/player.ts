class Player {
    id: string;
    name: string;
    isHost: boolean;

    constructor(playerId: string, playerName: string, isHost: boolean = false) {
        this.id = playerId;
        this.name = playerName;
        this.isHost = isHost;
    }

    GetName() {
        return this.isHost ? `* ${this.name}` : this.name;
    }
}

export default Player;