const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const superrequest = require("node-superfetch");
const {
    stripIndents
} = require('common-tags');

module.exports = {
    name: "define",
    description: "Defines words from Webster Dictionary",
    usage: "?def [word] or ?define [word]",
    async execute(bot, message, args) {

        const WEBSTER_KEY = "b85cd6b7-449e-46d3-839f-a305aa7777a7";
        try {
            const word = args.join(" ");
            if (!word.length) {
                return message.reply("Command Usage: `?define <Word>`")
            }
            const {
                body
            } = await superrequest
                .get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
                .query({
                    key: WEBSTER_KEY
                });
            if (!body.length) return message.channel.send('Could not find any results.');
            const data = body[0];
            if (typeof data === 'string') return message.channel.send(`Could not find any results. Did you mean **${data}**?`);
            if (data.fl === undefined) return message.channel.send(`Could not find any results. Try using other forms of the word.`);
            const embed = new Discord.MessageEmbed()
                .setTitle(`**${data.meta.stems[0]}** (${data.fl})`)
                .setDescription(stripIndents `${data.shortdef.map((definition, i) => `\n(${i + 1}) ${definition}`).join('\n')}
            `)
                .setColor(colours.gold)

            return message.channel.send({
                embeds: [embed]
            });
        } catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`.`);
        }

    }
}