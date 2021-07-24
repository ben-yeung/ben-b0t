const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const Canvas = require("canvas");
const disbut = require('discord-buttons');
const db = require('quick.db');

module.exports = {
    name: "highlow",
    description: "Game of higher or lower",
    usage: "?highlow",
    async execute(client, message, args) {

        const player = message.author.id

        // Prevent user from starting multiple games unless prior open game is older than 3 minutes
        if (db.get(`${player}.isplayinghighlow`) && Date.now() - db.get(`${player}.highlowstart`) <= 180000) {
            return message.reply("You have an existing game already! Please finish that game before moving on. (Inactive games expire in 3 minutes)")
        } else {
            db.set(`${player}.isplayinghighlow`, true)
            db.set(`${player}.highlowstart`, Date.now())
        }

        const canvas = Canvas.createCanvas(1500, 1100)
        const context = canvas.getContext('2d')

        var randCard = client.cards[Math.floor(Math.random() * client.cards.length)]

        const card = await Canvas.loadImage(`./media/cards/${randCard}`)
        const cardBack = await Canvas.loadImage(`./media/cardback.png`)
        context.drawImage(card, 0, 0, 700, 1100)
        context.drawImage(cardBack, 800, 0, 700, 1100)
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'card.png')

        db.set(`${player}.highlowstreak`, 0)
        db.set(`${player}.currcards`, [randCard])

        if (!db.get(`${player}.highlowrecord`)) db.set(`${player}.highlowrecord`, 0)

        let embed = new Discord.MessageEmbed()
            .setTitle("Higher or Lower?")
            .setColor(colours.purple_light)
            .setDescription(`Player: <@${player}> \n Highest Streak: ${db.get(`${player}.highlowrecord`)}`)
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
            await b.clicker.fetch();

            if (b.clicker.user.id == player) {
                if (Date.now() - db.get(`${b.clicker.user.id}.highlowstart`) >= 180000) { // Make buttons expire after 5min of inactivity
                    await b.reply.defer()
                    return
                }

                db.set(`${player}.highlowstart`, Date.now())
                context.clearRect(0, 0, canvas.width, canvas.height)
                if (b.id === 'highlow_gameover') { // Restart game
                    db.set(`${player}.highlowstreak`, 0)
                    randCard = client.cards[Math.floor(Math.random() * client.cards.length)]
                    db.set(`${player}.currcards`, [randCard])
                    db.set(`${player}.isplayinghighlow`, true)

                    context.clearRect(0, 0, canvas.width, canvas.height)
                    const newCardCanvas = await Canvas.loadImage(`./media/cards/${randCard}`)
                    context.drawImage(newCardCanvas, 0, 0, 700, 1100)
                    context.drawImage(cardBack, 800, 0, 700, 1100)
                    const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardnewgame.png')

                    let embed = new Discord.MessageEmbed()
                        .setTitle("Higher or Lower?")
                        .setColor(colours.purple_light)
                        .setDescription(`Player: <@${player}> \n Highest Streak: ${db.get(`${player}.highlowrecord`)}`)
                        .attachFiles(cardAttachment)
                        .setImage('attachment://cardnewgame.png')

                    b.message.delete()
                    b.message.channel.send({
                        buttons: [lowBtn, highBtn],
                        embed: embed
                    })
                } else {
                    var newCard = randCard
                    let order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '1', 'J', 'Q', 'K'] // first char file name

                    let currVal = order.indexOf(randCard.substring(0, 1))

                    while (newCard == randCard || db.get(`${player}.currcards`).includes(newCard)) { //prevent exact same card from being drawn
                        newCard = client.cards[Math.floor(Math.random() * client.cards.length)]
                    }

                    let newVal = order.indexOf(newCard.substring(0, 1))
                    var outcome = ''
                    db.push(`${player}.currcards`, newCard)

                    console.log(`${currVal} Card: ${randCard}`)
                    console.log(`${newVal} Card: ${newCard}`)

                    var possibleCards = []

                    for (var i = 0; i < 52; i++) {
                        if (!db.get(`${player}.currcards`).includes(client.cards[i])) {
                            possibleCards.push(client.cards[i].replace('.png', ''))
                        }
                    }

                    if (b.id === 'highlow_higher') {
                        if (currVal < newVal) { // User is correct
                            outcome = 'correct'
                        } else if (currVal >= newVal) { // User is incorrect
                            outcome = 'wrong'
                        }
                    } else if (b.id === 'highlow_lower') {
                        if (currVal > newVal) { // User is correct
                            outcome = 'correct'
                        } else if (currVal <= newVal) { // User is incorrect
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
                        db.add(`${player}.highlowstreak`, 1)
                        db.push(`${player}.currcards`, randCard)

                        let currStreak = db.get(`${player}.highlowstreak`)
                        let highestStreak = (db.get(`${player}.highlowrecord`) > currStreak) ? db.get(`${player}.highlowrecord`) : currStreak

                        if (currStreak === 52 && db.get(`${player}.highlowrecord`) < 52) {
                            const winScreen = await Canvas.loadImage(`./media/win.png`)
                            context.drawImage(winScreen, 0, 0, canvas.width, canvas.height)
                            const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardwin.png')
                            let embed = new Discord.MessageEmbed()
                                .setTitle("Higher or Lower?")
                                .setColor(colours.green_light)
                                .setDescription(`Player: <@${player}> \n Highest Streak: ${highestStreak} \n Current Streak: ${currStreak}`)
                                .attachFiles(cardAttachment)
                                .setImage('attachment://cardwin.png')

                            b.message.channel.send({
                                buttons: [gameoverBtn],
                                embed: embed
                            })
                            b.reply.defer()
                            return
                        } else { // Enables endless mode for winners
                            db.set(`${player}.currcards`, [randCard])
                        }

                        const correctLabel = await Canvas.loadImage(`./media/correct.png`)
                        context.drawImage(correctLabel, canvas.width / 4 - 150, canvas.height / 4, 1000, 500)
                        const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardcorrect.png')
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Higher or Lower?")
                            .setColor(colours.green_light)
                            .setDescription(`Player: <@${player}> \n Highest Streak: ${highestStreak} \n Current Streak: ${currStreak}`)
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
                                    .setColor(colours.purple_light)
                                    .setDescription(`Player: <@${player}> \n Highest Streak: ${highestStreak} \n Current Streak: ${currStreak} \n Possible Cards: ${possibleCards.join(', ')}`)
                                    .attachFiles(updatedAttach)
                                    .setImage('attachment://cardnext.png')

                                message.delete()
                                b.message.channel.send({
                                    buttons: [lowBtn, highBtn],
                                    embed: embed
                                })
                            }, 1000)
                        })

                    } else {
                        let currStreak = db.get(`${player}.highlowstreak`)
                        let highestStreak = (db.get(`${player}.highlowrecord`) > currStreak) ? db.get(`${player}.highlowrecord`) : currStreak
                        db.set(`${player}.highlowrecord`, highestStreak)
                        db.set(`${player}.isplayinghighlow`, false)

                        const wrongLabel = await Canvas.loadImage(`./media/wrong.png`)
                        context.drawImage(wrongLabel, canvas.width / 4 - 150, canvas.height / 4, 1000, 500)
                        const cardAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cardgameover.png')
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Higher or Lower?")
                            .setColor(colours.red_light)
                            .setDescription(`Player: <@${player}> \n Highest Streak: ${highestStreak} \n Current Streak: ${currStreak}`)
                            .attachFiles(cardAttachment)
                            .setImage('attachment://cardgameover.png')
                        b.message.channel.send({
                            buttons: [gameoverBtn],
                            embed: embed
                        })
                    }
                }

            }
            b.reply.defer()

        })

    }
}