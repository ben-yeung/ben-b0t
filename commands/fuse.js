const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "fuse",
    description: "Canvacord API",
    usage: "?fuse [@user] [@user]",
    async execute(bot, message, args) {

        if (!message.mentions.users.first()) return message.reply("Please @ two people. If only 1 @ then author is assumed.")

        let user1;
        let user2;
        var count = 0;
        message.mentions.users.forEach(user => {
            count++;
            if (count >= 3) return message.reply("Only mention at most 2 users.");
            if (count === 1) {
                user1 = user;
            } else {
                user2 = user;
            }
        })
        if (!user2) user2 = message.author;

        const avatar1 = user1.displayAvatarURL({
            format: "png"
        });
        const avatar2 = user2.displayAvatarURL({
            format: "png"
        });
        const image = await canvacord.Canvas.fuse(avatar1, avatar2);
        let attachment = new Discord.MessageAttachment(image, "concord.png");
        message.channel.send(attachment);

    }
}