const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Let the bot decide between choices for you!",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 2,
    expectedArgs: '<choice1> <choice2> [choice3] [choice4] [choice5] [choice6] [choice7] [choice8] [choice9] [choice10]', //note: have these all lowercased!
    callback: ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {

        let choice = args[Math.floor(Math.random() * args.length)]
        let phrases = ['Survey says:', 'I\'m feeling:', 'Local expert recommends:', 'Siri said:', 'If I were you I would choose:', 'This is a good choice:', 'I would definitely choose:']
        let phraseChoice = phrases[Math.floor(Math.random() * phrases.length)]

        return `${phraseChoice} **${choice}**`
    },
}