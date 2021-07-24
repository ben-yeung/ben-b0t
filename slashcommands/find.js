const Discord = require("discord.js")
const colours = require("../colours.json");
const botconfig = require("../botconfig.json");
var Scraper = require('images-scraper');
const disbut = require('discord-buttons');
const db = require('quick.db');
const ms = require("ms");

// Note that heroku might not launch natively with Puppeteer. 
// See https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack

var google = new Scraper({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    safe: true
})

module.exports = {
    slash: true,
    description: "Search Google Images for anything! ... for the most part",
    testOnly: true, //guild testing when true, set to false for global
    minArgs: 1,
    expectedArgs: '<query>', //note: have these all lowercased!
    callback: async ({ // put async after 'callback:' for async functions
        client,
        channel,
        interaction,
        args
    }) => {
        const [search] = args
        const author = interaction.member.user

        if (db.get(`${author.id}.findstarted`) && Date.now() - db.get(`${author.id}.findstarted`) <= 60000) {
            return `Please close your most recent find command or wait ${ms(60000 - (Date.now()- db.get(`${author.id}.findstarted`)))} before starting another query!`
        } else {
            db.set(`${author.id}.findquery`, [])
            db.set(`${author.id}.findstarted`, Date.now())
        }

        const intros = ['Searching the web for', 'Scouring the web for', 'Researching scholarly articles for', 'Surfing the web for', 'Checking a picture book for', 'Feeling lucky? Looking for', 'Hey Alexa, what is a', 'Hey Siri, what is a', 'Asking a professor for']
        let choice = intros[Math.floor(Math.random() * intros.length)]

        client.reply(interaction, `${choice} \`${search}\` <a:working:821570743329882172>`)

        const img_res = await google.scrape(search, 10)
        if (!img_res.length) return "No images found with these keywords. It might be NSFW 😳"

        let currInd = 0
        let chosenOne = img_res[currInd].url
        let chosenOneSRC = img_res[currInd].source

        let embed = new Discord.MessageEmbed()
            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
            .setDescription(`Asker: <@${author.id}> \n`)
            .setColor(colours.green_light)
            .setImage(chosenOne)
            .setFooter("Buttons will stop working after 1 minute.")
            .setTimestamp()

        let nextBtn = new disbut.MessageButton()
            .setLabel('Next')
            .setID('slashfind_next')
            .setStyle('blurple')

        let prevBtn = new disbut.MessageButton()
            .setLabel('Back')
            .setID('slashfind_prev')
            .setStyle('blurple')
            .setDisabled()

        let closeBtn = new disbut.MessageButton()
            .setLabel('Close')
            .setID('slashfind_close')
            .setStyle('red')

        let sourceBtn = new disbut.MessageButton()
            .setLabel('Source')
            .setURL(chosenOneSRC)
            .setStyle('url')

        const message = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
            data: {}
        })

        let messageObj = new Discord.Message(client, message, client.channels.cache.get(message.channel_id))
        db.set(`${author.id}.findquery`, [img_res, messageObj])

        messageObj.edit(' ­') //invisible char to make embed edit cleaner
        messageObj.channel.send({
            buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
            embed: embed
        })

        client.on('clickButton', async (b) => {
            await b.clicker.fetch();

            if (b.clicker.user.id === author.id && db.get(`${b.clicker.user.id}.findquery`)) {
                if (Date.now() - db.get(`${b.clicker.user.id}.findstarted`) >= 60000) { // Make buttons expire after 60 seconds
                    await b.reply.defer()
                    return
                } else {
                    if (b.id === 'slashfind_next') {
                        prevBtn.disabled = false
                        currInd++
                        let chosenOne = db.get(`${b.clicker.user.id}.findquery`)[0][currInd].url
                        let chosenOneSRC = db.get(`${b.clicker.user.id}.findquery`)[0][currInd].source
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                            .setDescription(`Asker: <@${author.id}> \n`)
                            .setColor(colours.green_light)
                            .setImage(chosenOne)
                            .setFooter("Buttons will stop working after 1 minute.")
                            .setTimestamp()

                        if (currInd == 9 || currInd == img_res.length) {
                            nextBtn.disabled = true
                        } else {
                            nextBtn.disabled = false
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        await b.message.edit({
                            buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                            embed: embed
                        })
                        b.reply.defer();

                    } else if (b.id === 'slashfind_prev') {
                        nextBtn.disabled = false
                        currInd--
                        let chosenOne = db.get(`${b.clicker.user.id}.findquery`)[0][currInd].url
                        let chosenOneSRC = db.get(`${b.clicker.user.id}.findquery`)[0][currInd].source
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                            .setDescription(`Asker: <@${author.id}> \n`)
                            .setColor(colours.green_light)
                            .setImage(chosenOne)
                            .setFooter("Buttons will stop working after 1 minute.")
                            .setTimestamp()

                        if (currInd === 0) {
                            prevBtn.disabled = true
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        await b.message.edit({
                            buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                            embed: embed
                        })
                        b.reply.defer();

                    } else if (b.id === 'slashfind_close') {
                        b.message.delete() // Delete bot embed
                        await b.channel.messages.fetch(db.get(`${b.clicker.user.id}.findquery`)[1].id).then(m => {
                            m.delete()
                        })
                        db.delete(`${b.clicker.user.id}.findstarted`)
                        b.reply.defer();
                    }
                }
            } else {
                b.reply.defer()
            }
        })
    },
}