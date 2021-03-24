const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

module.exports = {
    name: "vaporwave",
    description: "Creates aesthetic text",
    usage: "?vaporwave [msg]",
    execute(bot, message, args) {

        if (!args[0]) return message.reply("What you want me to say?");

        let msgstring = args.join(" ");

        let msgstringVapor = msgstring.split('').join(' ');

        String.prototype.toFullWidth = function () {
            return this.replace(/[A-Za-z0-9]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
            });
        };

        message.channel.send(msgstringVapor.toFullWidth());

    }
}