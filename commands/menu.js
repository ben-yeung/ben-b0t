const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const disbut = require('discord.js');

// Regular prefix command handling
module.exports = {
    name: "menu",
    description: "Testing discord buttons menu dropdown",
    usage: "?menu",
    execute(client, message, args) {

        let dropdown = new disbut.MessageMenu()
            .setID(message.id)
            .setPlaceholder('CLICK ME 😡')
            .setMinValues(1)
            .setMaxValues(10)

        let emojiList = ['🍉', '🍋', '🍇', '🍅', '🥝', '🌶️', '🍑', '🍄', '🍐', '🍍']
        for (var i = 0; i < 10; i++) {
            let option = new disbut.MessageMenuOption()
                .setLabel(`NUMBER ${i + 1}`)
                .setEmoji(emojiList[i])
                .setValue(`Option ${i + 1}`)
                .setDescription(`This is the number ${i + 1} slot`)

            dropdown.addOption(option)
        }
        let row = new disbut.MessageActionRow().addComponents(dropdown);

        var menuResponses = new Map()
        client.responses.set(message.id, menuResponses)

        let embed = new Discord.MessageEmbed()
            .setTitle('Menu Command')
            .setColor(colours.blurple)
            .setDescription('Select from the options below! Min Args: 1 Max Args: 10')

        message.reply({
            embed: embed,
            components: [row]
        })

        client.on('clickMenu', async menu => {

            await menu.clicker.fetch()

            let choices = menu.values
            if (!client.responses.get(menu.id)) {
                console.log("Error occurred finding menu")
                return
            }
            client.responses.get(menu.id).set(choices, menu.clicker.id)
            let desc = ''

            client.responses.get(menu.id).forEach((user, options) => {
                let profile = `<@${user}> chose ${options.join(" ")} \n`
                desc += profile
            });

            let embed = new Discord.MessageEmbed()
                .setTitle('Menu Command')
                .setColor(colours.blurple)
                .setDescription(`Select from the options below! Min Args: 1 Max Args: 10 \n\n ${desc}`)

            menu.message.edit(embed)
            await menu.reply.defer()
        })

    }
}