const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "clap",
    description: "Randomized Upper/lowercase with clap emojis for emphasis",
    usage: "?clap [msg]",
    execute(bot, message, args) {

        if (args.length < 1) {
            return message.reply("You must give me text to clap together.")
        }
        const randomizeCase = word => word.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
        return message.channel.send(`:clap: ${args.map(randomizeCase).join(' :clap: ')} :clap:`);

    }
}