const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "kick",
    description: "Kicks a given user. Moderator only",
    usage: "?kick [@user]",
    async execute(bot, message, args) {

        if (!message.member.hasPermission(["KICK_MEMBERS"])) return message.reply("Sorry you don't have that permission.");

        const member = message.mentions.users.first();
        if (!args[0]) return message.reply("Please specify a user to kick.")
        if (!member) return message.reply("The mentioned user is not in the server.")
        if (!member.kickable) return message.reply("You cannot kick that user.")
        try {
            await member.kick();
        } catch (err) {
            console.log(err);
            return message.reply("Error kicking specified user.")
        }

    }
}