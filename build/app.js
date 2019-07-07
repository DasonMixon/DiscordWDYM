"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discordjs = require("discord.js");
var dotenv = require("dotenv");
dotenv.config();
var client = new discordjs.Client();
client.on('ready', function () {
    console.log("Loged in as " + client.user.tag);
});
client.on('message', function (message) {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});
client.login(process.env.BOT_TOKEN);
