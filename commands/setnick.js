const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "setnick",
    description: "Sets the bot's current nickname",
    usage: "?setick [name]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
            return message.channel.send("You can not use this command!")
        }

        if (!args.length) return message.reply("Must include the name to change to.")

        let name = args.join(" ")
        message.guild.me.setNickname(name);

    }
}