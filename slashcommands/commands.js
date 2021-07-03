const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Returns all active commands",
    testOnly: false, //guild testing when true, set to false for global
    permissions: ['ADMINISTRATOR'],
    callback: async ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        channel,
        interaction,
        args
    }) => {

        const commands = await client.api.applications(client.user.id).commands.get()
        var cmdList = []
        for (const command of commands) {
            cmdList.push(`/${command.name}`)
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Active Commands')
            .setDescription(cmdList.join(' \n'))
            .setColor(colours.orange)
            .setTimestamp()

        return embed
    },
}