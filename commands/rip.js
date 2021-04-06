const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "rip",
    description: "Canvacord API",
    usage: "?rip [@user]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply("Please @ a user to use this command.")
        const user = message.mentions.users.first();
        const avatar = user.displayAvatarURL({
            format: "png"
        });
        const image = await canvacord.Canvas.rip(avatar);
        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);
        message.channel.send(`F in the chat for <@${user.id}>`);
        message.delete();

    }
}