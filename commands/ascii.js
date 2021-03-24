const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const figlet = require("figlet");

module.exports = {
    name: "ascii",
    description: "Turns text into ascii art",
    usage: "?ascii [msg]",
    execute(bot, message, args) {

        if (!args.length) {
            return message.reply("Please specify text for the ascii conversion");
        }
        var msg = args.join(" ");

        figlet.text(msg, function (err, data) {
            if (err) {
                message.channel.send("Error thrown when trying to convert.");
                console.log("Something went wrong");
            }
            if (data.length > 2000) {
                return message.reply("Yo that message is over 2000 characters. Too big no homo.")
            }

            message.channel.send('```' + data + '```');

        })

    }
}