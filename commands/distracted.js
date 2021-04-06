const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const canvacord = require("canvacord");

module.exports = {
    name: "distracted",
    description: "Canvacord API",
    usage: "?distracted [@user or Image Link] [@user or Image Link] [@user or Image Link]. \n1st index for girl in red, 2nd index for guy, 3rd index for jealous girl [optional]",
    async execute(bot, message, args) {

        if (!args[0]) return message.reply(`Please follow format: **${module.exports.usage}**`);
        if (args.length > 3) return message.reply(`Please follow format: **${module.exports.usage}**`);
        if (args.length < 2) return message.reply(`Please follow format: **${module.exports.usage}**`);
        let user1;
        let user2;
        let user3;
        let avatar1;
        let avatar2;
        let avatar3;
        var count = 0;
        message.mentions.users.forEach(user => {
            count++;
            if (count > 3) return message.reply("Only mention at most 3 users.");
            let id = `<@!${user.id}>`;
            if (args[0] === id) {
                user1 = user;
            } else if (args[1] === id) {
                user2 = user;
            } else {
                user3 = user;
            }
        })
        if (!user1) {
            avatar1 = args[0];
        } else {
            avatar1 = user1.displayAvatarURL({
                format: 'png'
            })
        }
        if (!user2) {
            avatar2 = args[1];
        } else {
            avatar2 = user2.displayAvatarURL({
                format: 'png'
            })
        }
        if (!user3) {
            avatar3 = args[2];
        } else {
            avatar3 = user3.displayAvatarURL({
                format: 'png'
            })
        }



        try {
            var image;
            if (!avatar3) {
                image = await canvacord.Canvas.distracted(avatar1, avatar2);
            } else {
                image = await canvacord.Canvas.distracted(avatar1, avatar2, avatar3);
            }
            let attachment = new Discord.MessageAttachment(image, "concord.png");
            message.channel.send(attachment);
            message.delete();
        } catch (err) {
            console.log(err);
            return message.reply(`Please follow format: **${module.exports.usage}**`)
        }

    }
}