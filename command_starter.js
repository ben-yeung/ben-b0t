const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");

// Regular prefix command handling
module.exports = {
    name: "",
    description: "",
    usage: "?",
    execute(bot, message, args) {



    }
}

// Slash command handling with WOKCommands
// Guild testing allows for instant command edit updates for whitelisted servers
//see https://docs.wornoffkeys.com/commands/commands for more command properties
const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "TODO",
    testOnly: true, //guild testing when true, set to false for global
    minArgs: 2,
    expectedArgs: '<required> <required> [optional]', //note: have these all lowercased!
    callback: ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [args1, args2, args3] = args

        return 'hello' //use return for slash commands for POST output!
    },
}