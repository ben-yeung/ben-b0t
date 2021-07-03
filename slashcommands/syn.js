const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
const thes = require("thesaurus");

module.exports = {
    slash: true,
    description: "Returns synonyms for a given word!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<word>', //note: have these all lowercased!
    callback: ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [query] = args

        if (query.split(' ').length > 1) return 'I can only lookup one word at a time!'

        let results = thes.find(query);

        let synon = results.join(", ")

        if (synon.length == 0) {
            return 'I couldn\'t find anything for that word. Try to avoid plural forms of words!'
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(query)
            .setColor("ORANGE")
            .addField("Synonyms", synon)

        return embed
    },
}