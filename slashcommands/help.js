const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "View all active slash commands!",
    testOnly: false, //guild testing when true, set to false for global
    callback: async ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        channel,
        interaction,
    }) => {

        const embed = new Discord.MessageEmbed()
            .setTitle('Active Commands')
            .setDescription(client.slashcommands)
            .setColor(colours.orange)
            .setTimestamp()

        try {
            let user = await client.users.fetch(`${interaction.member.user.id}`)
            user.send(embed)
            return 'Check DMs 😳'

        } catch (e) {
            console.log(e)
        }
        return 'Given user cannot be found'
    },
}