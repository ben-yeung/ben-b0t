const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "resume",
    description: "Resumes the stream if a current song is paused",
    usage: "?resume",
    execute(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to use this command.")

        client.distube.resume(message)
        message.reply(`<@${message.author.id}> resumed the groovy train.`)

    }
}