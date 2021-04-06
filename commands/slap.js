const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "slap",
    description: "Slaps given user or self. Canvacord API",
    usage: "?slap [@user]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply(`Please follow format: **${module.exports.usage}**`);

        const user = message.mentions.users.first();
        const avatar = user.displayAvatarURL({
            format: "png"
        });
        const image = await canvacord.Canvas.slap(message.author.displayAvatarURL({
            format: "png"
        }), avatar);
        let attachment = new Discord.MessageAttachment(image, "slap.png");
        message.channel.send(attachment);
        message.delete();

    }
}