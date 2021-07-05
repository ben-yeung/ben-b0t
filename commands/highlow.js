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

        const canvas = Canvas.createCanvas(1500, 1100)
        const context = canvas.getContext('2d')

        var randCard = client.cards[Math.floor(Math.random() * client.cards.length)]

        const card = await Canvas.loadImage(`./media/cards/${randCard}`)
        const cardBack = await Canvas.loadImage(`./media/cardback.png`)
        context.drawImage(card, 0, 0, 700, 1100)
        context.drawImage(cardBack, 800, 0, 700, 1100)
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'card.png')

        const player = message.author.id

        let embed = new Discord.MessageEmbed()
            .setTitle("Higher or Lower?")
            .setColor(colours.purple_medium)
            .setDescription(`Player: <@${player}>`)
            .attachFiles(attachment)
            .setImage('attachment://card.png')

        let lowBtn = new disbut.MessageButton()
            .setLabel('⠀⠀⠀⠀⠀⠀⠀Lower⠀⠀⠀⠀⠀⠀⠀­')
            .setID('highlow_lower')
            .setStyle('red')

        let highBtn = new disbut.MessageButton()
            .setLabel('⠀⠀⠀⠀⠀⠀⠀Higher⠀⠀⠀⠀⠀⠀⠀')
            .setID('highlow_higher')
            .setStyle('green')

        let gameoverBtn = new disbut.MessageButton()
            .setLabel('⠀⠀⠀⠀⠀Play Again?⠀⠀⠀⠀⠀')
            .setID('highlow_gameover')
            .setStyle('blurple')

        message.channel.send({
            buttons: [lowBtn, highBtn],
            embed: embed
        })

        client.on('clickButton', async (b) => {
            b.reply.defer()
            await b.clicker.fetch();

            if (b.clicker.user.id == player) {
                context.clearRect(0, 0, canvas.width, canvas.height)
                if (b.id === 'highlow_gameover') { // Restart game
                    randCard = client.cards[Math.floor(Math.random() * client.cards.length)]

                    context.clearRect(0, 0, canvas.width, canvas.height)
                    const newCardCanvas = await Canvas.loadImage(`./media/cards/${randCard}`)
                    context.drawImage(newCardCanvas, 0, 0, 700, 1100)
                    context.drawImage(cardBack, 800, 0, 700, 1100)
                    const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardnewgame.png')

                    let embed = new Discord.MessageEmbed()
                        .setTitle("Higher or Lower?")
                        .setColor(colours.purple_medium)
                        .setDescription(`Player: <@${player}>`)
                        .attachFiles(cardAttachment)
                        .setImage('attachment://cardnewgame.png')

                    b.message.delete()
                    message.channel.send({
                        buttons: [lowBtn, highBtn],
                        embed: embed
                    })
                } else {
                    var newCard = randCard
                    let order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '1', 'J', 'Q', 'K'] // 1 -> 10 file name

                    let currVal = order.indexOf(randCard.substring(0, 1))

                    while (newCard == randCard) { //prevent exact same card from being drawn
                        newCard = client.cards[Math.floor(Math.random() * client.cards.length)]
                    }

                    let newVal = order.indexOf(newCard.substring(0, 1))
                    var outcome = ''

                    console.log(`${currVal} Card: ${randCard}`)
                    console.log(`${newVal} Card: ${newCard}`)

                    if (b.id === 'highlow_higher') {
                        if (currVal < newVal) { // User is correct
                            outcome = 'correct'
                        } else if (currVal > newVal) { // User is incorrect
                            outcome = 'wrong'
                        } else { // New card and Curr card are same value
                            outcome = 'wrong'
                        }
                    } else if (b.id === 'highlow_lower') {
                        if (currVal > newVal) { // User is correct
                            outcome = 'correct'
                        } else if (currVal < newVal) { // User is incorrect
                            outcome = 'wrong'
                        } else { // New carda nd Curr card are same value
                            outcome = 'wrong'
                        }
                    }

                    const currCardCanvas = await Canvas.loadImage(`./media/cards/${randCard}`)
                    context.drawImage(currCardCanvas, 0, 0, 700, 1100)
                    const newCardCanvas = await Canvas.loadImage(`./media/cards/${newCard}`)
                    context.drawImage(newCardCanvas, 800, 0, 700, 1100)

                    b.message.delete()

                    if (outcome == 'correct') {
                        randCard = newCard

                        const correctLabel = await Canvas.loadImage(`./media/correct.png`)
                        context.drawImage(correctLabel, canvas.width / 4 - 150, canvas.height / 4, 1000, 500)
                        const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardcorrect.png')
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Higher or Lower?")
                            .setColor(colours.purple_medium)
                            .setDescription(`Player: <@${player}>`)
                            .attachFiles(cardAttachment)
                            .setImage('attachment://cardcorrect.png')

                        b.message.channel.send(embed).then(message => {
                            setTimeout(function () {
                                context.clearRect(0, 0, canvas.width, canvas.height)
                                context.drawImage(newCardCanvas, 0, 0, 700, 1100)
                                context.drawImage(cardBack, 800, 0, 700, 1100)
                                const updatedAttach = new Discord.MessageAttachment(canvas.toBuffer(), 'cardnext.png')
                                let embed = new Discord.MessageEmbed()
                                    .setTitle("Higher or Lower?")
                                    .setColor(colours.purple_medium)
                                    .setDescription(`Player: <@${player}>`)
                                    .attachFiles(updatedAttach)
                                    .setImage('attachment://cardnext.png')

                                message.delete()
                                b.message.channel.send({
                                    buttons: [lowBtn, highBtn],
                                    embed: embed
                                })
                            }, 1500)
                        })

                    } else {
                        const wrongLabel = await Canvas.loadImage(`./media/wrong.png`)
                        context.drawImage(wrongLabel, canvas.width / 4 - 150, canvas.height / 4, 1000, 500)
                        const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardgameover.png')
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Higher or Lower?")
                            .setColor(colours.purple_medium)
                            .setDescription(`Player: <@${player}>`)
                            .attachFiles(cardAttachment)
                            .setImage('attachment://cardgameover.png')
                        b.message.channel.send({
                            buttons: [gameoverBtn],
                            embed: embed
                        })
                    }
                }

            }

        })

    }
}