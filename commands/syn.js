const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const thes = require("thesaurus");

module.exports = {
    name: "syn",
    description: "Returns synonyms for given word",
    usage: "?sync [word]",
    execute(bot, message, args) {

        const query = args.join(" ")
        if (!query) {
            return message.reply("No word given!")
        } else if (args.length > 1) {
            return message.reply("I can only do one word at a time.")
        }
        let results = thes.find(query);

        let synon = results.join(", ")

        if (synon.length == 0) {
            return message.reply("I couldn't find anything for that word. It might not directly have a synonym. Also try to avoid plural forms of words!")
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(query)
            .setColor("ORANGE")
            .addField("Synonyms", synon)

        return message.channel.send({
            embeds: [embed]
        });

    }
}