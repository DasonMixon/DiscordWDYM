import discordjs  = require('discord.js');
import Game from "./game";
import Player from "./player";
import GameAlreadyExistsException from "../exceptions/GameAlreadyExistsException";
import GameNotFoundException from "../exceptions/GameNotFoundException";

class GameManager {
    lobbyMessagePart1 = 'A game has been created in this text channel! To join, type !joingame. \n\nCurrent Players:';
    lobbyMessagePart2 = '\n\nOnce there are 3 or more players in the lobby, the host can type !startgame to start the game';

    games: Game[]

    constructor() {
        this.games = [];
    }

    CreateGame(id: string, message: discordjs.Message) : Game {
        // Check if a game with this id already exists
        if (this.games.find(function(game) { return game.id === id; }) !== undefined)
            throw new GameAlreadyExistsException(`A game with id ${id} already exists`);

        // Create the game
        var game = new Game(id);
        this.games.push(game);

        // Join the current player into the game
        this.JoinGame(game.id, message.author, true);

        // Create the game lobby message
        message.channel.send(this.GetUpdatedGameLobbyPlayersMessage(game)).then((message) => game.lobbyMessage = message as discordjs.Message);
        
        return game;
    }

    CloseGame(id: string) {
        // Get the game reference
        var game = this.games.find(function(game) { return game.id === id; });
        
        // Check if the game exists
        if (game !== undefined) {
            // Update the game's lobby message
            this.UpdateGameLobbyMessage(game, 'The game lobby has been closed');
            
            // Delete the game
            this.games.splice(this.games.indexOf(game), 1);
        }
    }
    
    JoinGame(gameId: string, user: discordjs.User, isHost: boolean = false) {
        // Check if the game exists
        var game = this.games.find(function(game) { return game.id === gameId; });
        if (game === undefined)
            throw new GameNotFoundException(`A game with id ${gameId} was not found`);

        // Add player to game if they're not already joined
        var player = game.players.find(function(player) { return player.id === user.id; });
        if (player === undefined) {
            game.players.push(new Player(user.id, user.username, isHost));

            // Update the game's lobby message
                this.UpdateGameLobbyMessage(game, this.GetUpdatedGameLobbyPlayersMessage(game));
        }
    }

    LeaveGame(gameId: string, playerId: string) {
        // Check if the game exists
        var game = this.games.find(function(game) { return game.id === gameId; });
        if (game === undefined)
            throw new GameNotFoundException(`A game with id ${gameId} was not found`);

        // Remove the player from the game if they exist
        var player = game.players.find(function(player) { return player.id === playerId; });
        if (player !== undefined) {
            if (player.isHost) {
                // Close the game lobby
                this.CloseGame(gameId);
            } else {
                game.players.splice(game.players.indexOf(player), 1);
                
                // Update the game's lobby message
                this.UpdateGameLobbyMessage(game, this.GetUpdatedGameLobbyPlayersMessage(game));
            }
        }
    }

    private UpdateGameLobbyMessage(game: Game, message: string) {
        if (game.lobbyMessage !== undefined) {
            game.lobbyMessage.edit(message);
        }
    }

    private GetUpdatedGameLobbyPlayersMessage(game: Game) : string {
        return `${this.lobbyMessagePart1} ${game.players.map(p => `\n${p.GetName()}`)} ${this.lobbyMessagePart2}`;
    }
}

export default GameManager;