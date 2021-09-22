const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const distube = require("distube");

// Regular prefix command handling
module.exports = {
    name: "play",
    description: "Request ben-b0t to play audio from a YouTube Link. Must be in voice channel",
    usage: "?play [link]",
    async execute(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to use this command.")

        const queue = client.distube.getQueue(message)
        if (!queue && !args[0]) {
            return message.reply("You must give me a link or search request!")
        } else if (!args[0]) {
            client.distube.resume(message)
        } else {
            const query = args.join(" ")
            await client.distube.play(message, query)

        }

    }
}