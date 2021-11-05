const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "slap",
    description: "Slaps given user or self. Canvacord API",
    usage: "?slap [@user or Image Link] [@user or Image Link]",
    async execute(bot, message, args) {

        if (!args[0]) return message.reply(`Please follow format: **${module.exports.usage}**`)

        let user1;
        let user2;
        let avatar1;
        let avatar2;
        var count = 0;
        message.mentions.users.forEach(user => {
            count++;
            if (count >= 3) return message.reply("Only mention at most 2 users.");
            if (count === 1) {
                let id = `<@!${user.id}>`;
                if (args[0] === id) {
                    user1 = user;
                } else {
                    user2 = user;
                }
            } else {
                user2 = user;
            }
        })
        if (!user2) {
            if (!args[1]) {
                user2 = message.author;
                avatar2 = user2.displayAvatarURL({
                    format: 'png'
                });
            } else {
                avatar2 = args[1];
            }
        } else {
            avatar2 = user2.displayAvatarURL({
                format: 'png'
            });
        }

        if (!user1) {
            avatar1 = args[0];
        } else {
            avatar1 = user1.displayAvatarURL({
                format: 'png'
            })
        }
        try {
            let image = await canvacord.Canvas.slap(avatar2, avatar1);
            let attachment = new Discord.MessageAttachment(image, "concord.png");
            message.channel.send({
                files: [attachment]
            });
            message.delete();
        } catch (err) {
            console.log(err);
            return message.reply(`Please follow format: **${module.exports.usage}**`)
        }

    }
}