const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "invert",
    description: "Canvacord API",
    usage: "?invert [@user]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply(`Please follow format: **${module.exports.usage}**`)
        let user = message.mentions.users.first();
        let avatar = user.displayAvatarURL({
            format: 'png'
        });
        let image = await canvacord.Canvas.invert(avatar);

        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);
        message.delete();

    }
}