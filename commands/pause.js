const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "pause",
    description: "Pauses the current song",
    usage: "?pause",
    execute(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to use this command.")

        client.distube.pause(message)
        message.reply("has paused the current song.")

    }
}