const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "TODO",
    testOnly: true, //guild testing when true, set to false for global
    minArgs: 2,
    expectedArgs: '<required> <required> [optional]', //note: have these all lowercased!
    callback: ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        channel,
        interaction,
        args
    }) => {
        const [args1, args2, args3] = args

        return 'hello' //use return for slash commands for POST output!
    },
}