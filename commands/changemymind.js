const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "changemymind",
    description: "Returns cmm image with text",
    usage: "?cmm [text]",
    async execute(bot, message, args) {

        if (!args[0]) return message.reply("Must specify a message to append.");
        let msg = args.join(" ");
        let cmm = await canvacord.Canvas.changemymind(msg);
        let attachment = new Discord.MessageAttachment(cmm, "cmm.png");
        message.channel.send(attachment);

    }
}