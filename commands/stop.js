const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "leave",
    description: "Stops ben-b0t from playing music in a voice channel and makes ben-b0t leave.",
    usage: "?leave",
    async execute(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You must be in a voice channel to use this command.")

        const choices = [`<@${message.author.id}> has halted the groovy train.`, `<@${message.author.id}> cut the beat.`, `<@${message.author.id}> pressed pause.`, `<@${message.author.id}> stopped the music.`]
        let choice = choices[Math.floor(Math.random() * choices.length)]

        try {
            await client.distube.stop(message)
            await message.channel.send(choice)
        } catch (e) {
            message.reply("No queue present")
        }

    }
}