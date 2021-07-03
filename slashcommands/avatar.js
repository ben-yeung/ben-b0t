const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Returns a given user's avatar PNG",
    testOnly: false, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<user>', //note: have these all lowercased!
    callback: async ({ //see https://docs.wornoffkeys.com/commands/commands for more command properties
        client,
        message,
        channel,
        interaction,
        args,
        text
    }) => {
        let userid = interaction.data.options[0].value.replace(/[<@!>]/g, '')
        console.log(userid)

        try {
            let user = await client.users.fetch(userid)

            avatarURL = user.displayAvatarURL();
            let embed = new Discord.MessageEmbed()
                .setTitle(`Profile Picture`)
                .setImage(avatarURL)
                .setColor(colours.green_light)
                .setTimestamp()

            return embed

        } catch (e) {
            console.log(e)
        }
        return 'Given user cannot be found'
    },
}