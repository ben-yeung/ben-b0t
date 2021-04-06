const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "quote",
    description: "Canvacord API",
    usage: "?quote [@user] [message]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply(`Please follow format: **${module.exports.usage}**`)
        if (!args[1]) return message.reply("Please specify a message.");
        let user = message.mentions.users.first();
        let msg = args.slice(1).join(" ");
        let avatar = user.displayAvatarURL({
            format: 'png'
        });

        let ops = {
            'image': avatar,
            'message': msg,
            'username': user.username
        }
        let image = await canvacord.Canvas.quote(ops);

        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);
        message.delete();

    }
}