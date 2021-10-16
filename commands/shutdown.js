const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const {
    Permissions
} = require('discord.js');

module.exports = {
    name: "sd",
    description: "Shuts down the bot",
    usage: "?shutdown",
    async execute(bot, message, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You don't have the permission to kill me.");

        try {
            await message.channel.send("good-bye world :'(")
            process.exit()
        } catch (e) {
            message.channel.send(`ERROR: ${e.message}`)
        }

    }
}