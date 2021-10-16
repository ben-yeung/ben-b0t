const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const {
    Permissions
} = require('discord.js');

module.exports = {
    name: "setnick",
    description: "Sets the bot's current nickname",
    usage: "?setnick [name]",
    execute(bot, message, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply("Sorry, you don't have access to that command.");

        if (!args.length) return message.reply("Must include the name to change to.")

        let name = args.join(" ")
        message.guild.me.setNickname(name);

    }
}