import discordjs = require('discord.js');
import Player from './player';

class Game {
    id: string;
    players: Player[];
    lobbyMessage: discordjs.Message | undefined;

    constructor(gameId: string) {
        this.id = gameId;
        this.players = [];
    }
}

export default Game;