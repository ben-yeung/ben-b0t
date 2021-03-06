const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "type",
    description: "Trolls with Discord 'typing...' in channel given",
    usage: "?type [channel id] [T/F]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
            return message.channel.send("You can not use this command!");
        }
        if (!args[0]) return message.reply("Please specify a channel by mentioning it.");

        let mChannel = message.guild.channels.cache.get(args[0]);
        if (!mChannel) return message.reply("Please specify a channel by mentioning it.");

        if (!args[1]) return message.reply("Please specify whether this command is true or false. (T/F)");
        let cond = args[1].toLowerCase();
        if (cond == "t" || cond == "true") {
            mChannel.startTyping(true);
        } else if (cond == "f" || cond == "false") {
            mChannel.stopTyping(true);
        } else {
            return message.reply("Please specify whether this command is true or false. (T/F)");
        }

    }
}