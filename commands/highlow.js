const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const Canvas = require("canvas");
const disbut = require('discord-buttons');

module.exports = {
    name: "highlow",
    description: "Game of higher or lower",
    usage: "?highlow",
    async execute(client, message, args) {

        const canvas = Canvas.createCanvas(700, 1100)
        const context = canvas.getContext('2d')

        const randCard = client.cards[Math.floor(Math.random() * client.cards.length)]

        const card = await Canvas.loadImage(`./media/cards/${randCard}`)
        context.drawImage(card, 0, 0, canvas.width, canvas.height)
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'card.png')

        const player = message.author.id

        let embed = new Discord.MessageEmbed()
            .setTitle("Higher or Lower?")
            .setColor(colours.purple_medium)
            .setDescription(`Player: <@${player}>`)
            .attachFiles(attachment)
            .setImage('attachment://card.png')

        let lowBtn = new disbut.MessageButton()
            .setLabel('⠀⠀Lower⠀⠀­')
            .setID('highlow_lower')
            .setStyle('red')

        let highBtn = new disbut.MessageButton()
            .setLabel('⠀⠀Higher⠀⠀')
            .setID('highlow_higher')
            .setStyle('green')

        message.channel.send({
            buttons: [highBtn, lowBtn],
            embed: embed
        }).then(async (message, randCard) => {

            client.on('clickButton', (b) => {
                b.reply.defer()
                await b.clicker.fetch();

                var newCard = ''
                let order = ['A', '2', '3', '4', '5,', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

                while (newCard !== randCard) { //prevent exact same card from being drawn
                    newCard = client.cards[Math.floor(Math.random() * client.cards.length)]
                }



            })

        })

    }
}