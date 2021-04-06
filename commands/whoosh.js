const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "whoosh",
    description: "Canvacord API",
    usage: "?whoosh [@user]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply(`Please follow format: **${module.exports.usage}**`)
        const user = message.mentions.users.first();
        const avatar = user.displayAvatarURL({
            format: "png"
        });
        const image = await canvacord.Canvas.jokeOverHead(avatar);
        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);
        message.delete();

    }
}