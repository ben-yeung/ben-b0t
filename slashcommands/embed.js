const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    slash: true,
    description: "Testing args for embeds",
    minArgs: 2,
    expectedArgs: '<name> <age> [favorite game]',
    callback: ({
        args
    }) => {
        const [name, age, game] = args

        const embed = new Discord.MessageEmbed()
            .setTitle("Test Embed")
            .setDescription("poggers")
            .addField('Name', name)
            .addField('Age', age)
            .addField('Favorite Game', game || 'None')

        return embed
    },
}