const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
var request = require("request");

module.exports = {
    name: "cat",
    description: "Gets a random cat gif",
    usage: "?cat",
    execute(bot, message, args) {

        request('http://edgecats.net/random', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let emb = new Discord.MessageEmbed()
                    .setImage(body)
                    .setColor("#00ff00")
                    .setTitle("Random Cat Gif Generator")

                return message.channel.send({
                    embeds: [embed]
                })
            }
        });

    }
}