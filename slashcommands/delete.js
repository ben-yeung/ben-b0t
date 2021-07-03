const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Moderator command to delete slash commands by id",
    testOnly: true, //guild testing when true, set to false for global
    permissions: ['ADMINISTRATOR'],
    minArgs: 1,
    expectedArgs: '<command id>', //note: have these all lowercased!
    callback: ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        channel,
        interaction,
        args
    }) => {
        const [id] = args

        try {
            client.api.applications(client.user.id).commands(id).delete()
            return 'Slash command has been deleted'
        } catch (e) {
            console.log(e)
            return 'Error occurred see console'
        }
    },
}