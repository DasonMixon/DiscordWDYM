import discordjs = require('discord.js');
import dotenv = require('dotenv');
import GameManager from './models/gamemanager';
import GameAlreadyExistsException from './exceptions/GameAlreadyExistsException';
import GameNotFoundException from './exceptions/GameNotFoundException';

dotenv.config();
const client = new discordjs.Client();
const messagePrefix = '!';

let gameManager = new GameManager();

function CreateGame(message: discordjs.Message) {
    try {
        gameManager.CreateGame(message.channel.id, message);
    } catch (e) {
        if (e instanceof GameAlreadyExistsException) {
            message.reply('A game has already been created in this channel. Type !joingame to join or if you\'re the one who created the game and want to close it, type !endgame');
        } else {
            message.reply('Something went wrong, please try again');
            console.log(`Exception in app.CreateGame(): ${e}`);
        }
    }
}

function JoinGame(message: discordjs.Message) {
    try {
        gameManager.JoinGame(message.channel.id, message.author);
    } catch (e) {
        if (e instanceof GameNotFoundException) {
            message.reply('A game has not been created in this channel yet. Type !creategame to create one and join!');
        } else {
            message.reply('Something went wrong, please try again');
            console.log(`Exception in app.CreateGame(): ${e}`);
        }
    }
}

function LeaveGame(message: discordjs.Message) {
    try {
        gameManager.LeaveGame(message.channel.id, message.author.id);
    } catch (e) {
        if (e instanceof GameNotFoundException) {
            message.reply('A game has not been created in this channel yet. Type !creategame to create one and join!');
        } else {
            message.reply('Something went wrong, please try again');
            console.log(`Exception in app.CreateGame(): ${e}`);
        }
    }
}

function CloseGame(message: discordjs.Message) {
    gameManager.CloseGame(message.channel.id);
}

client.on('ready', () => {
    console.log(`Loged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    switch(message.content) {
        case `${messagePrefix}ping`:
            message.reply('pong');
            break;
        case `${messagePrefix}creategame`:
            CreateGame(message);
            break;
        case `${messagePrefix}joingame`:
            JoinGame(message);
            break;
        case `${messagePrefix}leavegame`:
            LeaveGame(message);
            break;
        case `${messagePrefix}endgame`:
            CloseGame(message);
            break;
        case `${messagePrefix}startgame`:
            break;
        
    }
    
});

client.login(process.env.BOT_TOKEN);