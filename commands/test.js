const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "test",
    description: "Canvacord API",
    usage: "?test [@user or Image Link]",
    async execute(bot, message, args) {

        if (!args[0]) return message.reply(`Please follow format: **${module.exports.usage}**`)
        let user = message.mentions.users.first();
        var img_before;
        if (!user) {
            img_before = args[0];
        } else {
            img_before = user.displayAvatarURL({
                format: 'png'
            });
        }
        try {
            let image = await canvacord.Canvas.beautiful(img_before);
            let attachment = new Discord.MessageAttachment(image, "concord.png");
            message.channel.send(attachment);
            message.delete();
        } catch (err) {
            console.log(err);
            return message.reply(`Please follow format: **${module.exports.usage}**`)
        }



    }
}