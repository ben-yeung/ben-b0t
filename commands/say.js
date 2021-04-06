const Discord = require("discord.js")

module.exports = {
    name: "say",
    description: "Makes bot say a message in a channel",
    usage: "?say [#channel] [msg]",
    execute(bot, message, args) {

        if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("You can not use this command!")
        if (!args[0]) return message.reply("Specify a channel id to send message to.");
        if (!args[1]) return message.reply("Please specify a message to send.");

        let argsresult = args.slice(1).join(" ");
        let mChannel = message.guild.channels.cache.get(args[0]);
        if (!mChannel) return message.reply("Channel id given cannot be found.")

        mChannel.send(argsresult);
        mChannel.stopTyping(true);

    }
}