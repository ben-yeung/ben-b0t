const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
var Scraper = require('images-scraper');
const db = require('quick.db');
const ms = require("ms");
const {
    MessageButton
} = require('discord-buttons');

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
    name: "find",
    description: "Returns results for Google Image search",
    usage: "?find [query]",
    async execute(client, message, args) {

        let search = args.join(" ");
        if (!search) return message.reply("Please enter a search query")
        const author = message.author
        const authorMessageID = message.id

        if (db.get(`${author.id}.findstarted`) && Date.now() - db.get(`${author.id}.findstarted`) <= 10000) {
            return message.reply(`Please close your most recent find command or wait ${ms(10000 - (Date.now()- db.get(`${author.id}.findstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.findstarted`, Date.now())
        }

        const intros = ['Searching the web for', 'Scouring the web for', 'Researching scholarly articles for', 'Surfing the web for', 'Checking a picture book for', 'Feeling lucky? Looking for', 'Hey Alexa, what is a', 'Hey Siri, what is a', 'Asking a professor for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${search}\` <a:working:821570743329882172>`).then(async (message) => { // replace with own emote <a:(emote id)>
            const img_res = await google.scrape(search, 10)
            // console.log(img_res)
            // console.log("\n----------------------------------------")
            if (!img_res.length) return message.channel.send("No images found with these keywords. It might be NSFW 😳")

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

            let nextBtn = new MessageButton()
                .setLabel('Next')
                .setID('find_next')
                .setStyle('blurple')

            let prevBtn = new MessageButton()
                .setLabel('Back')
                .setID('find_prev')
                .setStyle('blurple')
                .setDisabled()

            let closeBtn = new MessageButton()
                .setLabel('Close')
                .setID('find_close')
                .setStyle('red')

            let sourceBtn = new MessageButton()
                .setLabel('Source')
                .setURL(chosenOneSRC)
                .setStyle('url')

            message.edit(' ­') //invisible char to make embed edit cleaner
            message.edit({
                buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                embed: embed
            }).then(async (message) => {
                if (currInd >= img_res.length) return

                const collector = message.createButtonCollector((button) => button.clicker.user.id === author.id && Date.now() - db.get(`${button.clicker.user.id}.findstarted`) < 60000, {
                    time: 60000
                })

                collector.on('collect', async (b) => {
                    // console.log(b.id)

                    if (b.id === 'find_next') {
                        prevBtn.disabled = false
                        currInd++
                        let chosenOne = img_res[currInd].url
                        let chosenOneSRC = img_res[currInd].source
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

                    } else if (b.id === 'find_prev') {
                        nextBtn.disabled = false
                        currInd--
                        let chosenOne = img_res[currInd].url
                        let chosenOneSRC = img_res[currInd].source
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

                    } else if (b.id === 'find_close') {
                        b.message.delete() // Delete bot embed
                        await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        db.delete(`${author.id}.findstarted`)
                        b.reply.defer();
                        return
                    }
                    b.reply.defer();

                })

            })


            // Old way of handling embed pagination with react buttons

            // .then(async (message) => {
            //     if (currInd >= img_res.length) return
            //     await message.react('➡️')
            //     message.react('❌')

            //     const collector = message.createReactionCollector(
            //         // only collect left and right arrow reactions from the message author
            //         (reaction, user) => ['⬅️', '➡️', '↩️', '❌'].includes(reaction.emoji.name) && user.id === author.id,
            //         // time out after a minute
            //         {
            //             time: 90000
            //         }
            //     )

            //     collector.on('collect', reaction => {
            //         // remove the existing reactions
            //         message.reactions.removeAll().then(async () => {
            //             // increase/decrease index
            //             if (reaction.emoji.name === '⬅️') {
            //                 currInd -= 1
            //             } else if (reaction.emoji.name === '↩️') {
            //                 currInd = 0
            //             } else if (reaction.emoji.name === '❌') {
            //                 message.delete() // Delete bot embed
            //                 message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
            //                 return
            //             } else {
            //                 currInd += 1
            //             }
            //             // edit message with new embed
            //             let chosenOne = img_res[currInd].url
            //             let chosenOneSRC = img_res[currInd].source
            //             let embed = new Discord.MessageEmbed()
            //                 .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
            //                 .setDescription(`Asker: <@${author.id}> \n [Source](${chosenOneSRC}) \n`)
            //                 .setColor(colours.green_light)
            //                 .setImage(chosenOne)
            //                 .setFooter("Reacts will stop working after 1 minute. React with ❌ to delete query.")
            //             message.edit(embed)
            //             // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
            //             if (currInd !== 0) await message.react('⬅️')
            //             // react with right arrow if it isn't the end
            //             if (currInd + 1 < img_res.length) message.react('➡️')
            //             // react with back to start if isn't start
            //             if (currInd !== 0) message.react('↩️')
            //             // react with x to delete find query
            //             message.react('❌')
            //         })
            //     })

            // })
        })

    }
}