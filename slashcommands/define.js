const Discord = require("discord.js")
const colours = require("../colours.json");
const superrequest = require("node-superfetch");
const {
    stripIndents
} = require('common-tags');

module.exports = {
    slash: true,
    description: "Defines a given word!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<word>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const WEBSTER_KEY = "b85cd6b7-449e-46d3-839f-a305aa7777a7";
        try {
            const [word] = args;
            const {
                body
            } = await superrequest
                .get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
                .query({
                    key: WEBSTER_KEY
                });
            if (!body.length) return `Could not find results for \`${word}\`.`;
            const data = body[0];
            if (typeof data === 'string') return `Could not find any results. Did you mean **${data}**?`;
            if (data.fl === undefined) return `Could not find any results. Try using other forms of the word.`
            const embed = new Discord.MessageEmbed()
                .setTitle(`**${data.meta.stems[0]}** (${data.fl})`)
                .setDescription(stripIndents `${data.shortdef.map((definition, i) => `\n(${i + 1}) ${definition}`).join('\n')}
            `)
                .setColor(colours.gold)

            return embed
        } catch (err) {
            console.log(err)
            return 'Error occurred check console'
        }

    },
}