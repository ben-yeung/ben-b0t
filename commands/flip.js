const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "flip",
    description: "Flips a coin and returns the result",
    usage: "?flip",
    execute(bot, message, args) {

        let res = ['Heads', 'Tails'];
        let response = res[Math.floor(Math.random() * 2)];
        return message.reply(`<@${message.author.id}> flipped a coin and it's **${response}**`)

    }
}