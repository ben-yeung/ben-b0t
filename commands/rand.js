const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "rand",
    description: "Returns a random number",
    usage: "?rand [min] [max]",
    execute(bot, message, args) {

        if (args.length < 2) return message.reply("You must give me a min parameter and a max parameter!")

        let min = parseInt(args[0])
        let max = parseInt(args[1])

        if (isNaN(min) || isNaN(max)) return message.reply("Invalid numbers given as min and max values.")

        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(num)
        message.channel.send(`Survey says: ${num}`);

    }
}