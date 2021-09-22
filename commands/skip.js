const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "skip",
    description: "Skips current song in queue",
    usage: "?skip",
    async execute(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to use this command.")

        await client.distube.skip(message)
        await message.reply("Skipping current song")

    }
}