const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "youtube",
    description: "Canvacord API",
    usage: "?youtube [@user] [comment]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply(`Please follow format: ${usage}`)
        if (!args[1]) return message.reply("Please specify a message.");
        let user = message.mentions.users.first();
        let msg = args.slice(1).join(" ");
        let avatar = user.displayAvatarURL({
            format: 'png'
        });

        let ops = {
            'username': user.username,
            'content': msg,
            'avatar': avatar
        }
        let image = await canvacord.Canvas.youtube(ops);

        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);
        message.delete();

    }
}