import discordjs = require('discord.js');
import Player from './player';
import pack_data from '../data/pack_data.json';
import PlayerSubmission from './playersubmission';

class Game {
    id: string;
    players: Player[];
    lobbyMessage: discordjs.Message | undefined;
    roundMessage: discordjs.Message | undefined;
    channel: discordjs.TextChannel | undefined;
    inProgress: boolean = false;
    imageUrl: string = '';
    judgeId: string = '';
    judgeHand: PlayerSubmission[];

    judgeCards: string[];
    playerCards: string[];

    usedJudgeCards: string[];
    usedPlayerCards: string[];

    constructor(gameId: string) {
        this.id = gameId;
        this.players = [];
        this.judgeHand = [];
        
        this.judgeCards = pack_data.pictures.map(p => p.url);
        this.playerCards = pack_data.captionCards;

        this.usedJudgeCards = [];
        this.usedPlayerCards = [];
    }

    Start() {
        this.inProgress = true;
        this.imageUrl = this.GetRandomJudgeCard();

        if (this.channel === undefined)
            throw new Error('Channel undefined');

        var message = `${this.imageUrl}\nPlayer Submissions:\n${this.judgeHand.map((j, i) => `${i + 1}) ${j.playerName}: ${j.caption}`)}`;
        this.channel.send(message).then((message) => this.roundMessage = message as discordjs.Message);
    }

    End() {
        this.inProgress = false;
        this.imageUrl = '';
        this.judgeId = '';
        this.judgeHand = [];
    }

    Submit(submission: PlayerSubmission) {
        // Check if the player has already submitted or not
        var submitCard = this.judgeHand.find(function(submission) {
            return submission.playerId === submission.playerId;
        });

        if (submitCard === undefined) {
            this.judgeHand.push(submission);
        }

        this.UpdateRoundMessage();
    }

    private UpdateRoundMessage() {
        if (this.roundMessage !== undefined) {
            this.roundMessage.edit(`${this.imageUrl}\nPlayer Submissions:\n${this.judgeHand.map((j, i) => `${i + 1}) ${j.playerName}: ${j.caption}`)}`);
        }
    }

    private GetRandomJudgeCard() : string {
        if (this.judgeCards.length <= 0) {
            this.judgeCards = this.Shuffle(this.usedJudgeCards);
            this.usedJudgeCards = [];
        }

        var randomCard = this.judgeCards[Math.floor(Math.random() * this.judgeCards.length)]
        this.usedJudgeCards.push(randomCard);
        this.judgeCards.splice(this.judgeCards.indexOf(randomCard), 1);
    
        return randomCard;
    }

    private Shuffle(cards: string[]) : string[] {
        var currentIndex = cards.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temporaryValue;
        }

        return cards;
    }
}

export default Game;