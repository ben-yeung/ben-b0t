const Discord = require("discord.js")
const botconfig = require("../botconfig.json");

module.exports = {
    name: "sd",
    description: "Shuts down the bot",
    usage: "?shutdown",
    async execute(bot, message, args) {

        if (message.author.id != "229326615384031233") return message.channel.send("You're not the boss of me!")

        try {
            await message.channel.send("good-bye world :'(")
            process.exit()
        } catch (e) {
            message.channel.send(`ERROR: ${e.message}`)
        }

    }
}