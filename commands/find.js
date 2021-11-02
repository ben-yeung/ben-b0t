const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
var Scraper = require('images-scraper');
const db = require('quick.db');
const ms = require("ms");
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

// Note that heroku might not launch natively with Puppeteer. 
// See https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack

var google = new Scraper({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    safe: true
})

function pruneQueries(author) {
    let queries = db.get(`${author.id}.findquery`)
    if (!queries.length || queries.length == 0) return

    for (const [key, val] of Object.entries(queries)) {
        if (Date.now() - val[2] >= 120000) {
            delete queries[key]
            console.log("PRUNED A QUERY")
        }

    }
    db.set(`${author.id}.findquery`, queries)
}

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
            pruneQueries(author)
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
                .setFooter("Buttons will stop working after 2 minutes.")
                .setTimestamp()

            const nextBtn = new MessageButton()
                .setLabel('Next')
                .setCustomId('find_next')
                .setStyle('PRIMARY')

            const prevBtn = new MessageButton()
                .setLabel('Prev')
                .setCustomId('find_prev')
                .setStyle('PRIMARY')

            const closeBtn = new MessageButton()
                .setLabel('Close')
                .setCustomId('find_close')
                .setStyle('DANGER')

            const sourceBtn = new MessageButton()
                .setLabel('Source')
                .setURL(chosenOneSRC)
                .setStyle('LINK')

            prevBtn.disabled = true
            const row = img_res.length > 1 ? new MessageActionRow().addComponents(
                prevBtn, nextBtn, sourceBtn, closeBtn
            ) : new MessageActionRow().addComponents(
                sourceBtn, closeBtn
            )

            message.edit(' ­') //invisible char to make embed edit cleaner
            message.edit({
                components: [row],
                embeds: [embed]
            }).then(async (message) => {

                if (img_res.length <= 1) return

                let currQueries = db.get(`${author.id}.findquery`)
                currQueries[message.id] = [img_res, currInd, Date.now()]

                db.set(`${author.id}.findquery`, currQueries);

                // console.log(db.get(`${author.id}.findquery`))

                const filter = (btn) => {
                    return author.id === btn.user.id && btn.message.id == message.id
                }

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    time: 120000
                })

                collector.on('collect', async (ButtonInteraction) => {
                    //console.log(ButtonInteraction.customId)
                    const id = ButtonInteraction.customId

                    let queries = db.get(`${author.id}.findquery`)
                    // console.log(queries)
                    let img_res = queries[ButtonInteraction.message.id][0]
                    var currInd = queries[ButtonInteraction.message.id][1]

                    if (id === 'find_next') {
                        prevBtn.disabled = false
                        currInd++
                        queries[ButtonInteraction.message.id][1] = currInd;
                        db.set(`${author.id}.findquery`, queries)
                        let chosenOne = img_res[currInd].url
                        let chosenOneSRC = img_res[currInd].source
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                            .setDescription(`Asker: <@${author.id}> \n`)
                            .setColor(colours.green_light)
                            .setImage(chosenOne)
                            .setFooter("Buttons will stop working after 2 minutes.")
                            .setTimestamp()

                        if (currInd == 9 || currInd == img_res.length) {
                            nextBtn.disabled = true
                        } else {
                            nextBtn.disabled = false
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        const row = new MessageActionRow().addComponents(
                            prevBtn, nextBtn, sourceBtn, closeBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'find_prev') {
                        nextBtn.disabled = false
                        currInd--
                        queries[ButtonInteraction.message.id][1] = currInd;
                        db.set(`${author.id}.findquery`, queries)
                        let chosenOne = img_res[currInd].url
                        let chosenOneSRC = img_res[currInd].source
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Results for '${search}' | Page ${currInd + 1}`)
                            .setDescription(`Asker: <@${author.id}> \n`)
                            .setColor(colours.green_light)
                            .setImage(chosenOne)
                            .setFooter("Buttons will stop working after 2 minutes.")
                            .setTimestamp()

                        if (currInd === 0) {
                            prevBtn.disabled = true
                        }

                        sourceBtn.setURL(chosenOneSRC)
                        const row = new MessageActionRow().addComponents(
                            prevBtn, nextBtn, sourceBtn, closeBtn
                        )
                        await ButtonInteraction.message.edit({
                            components: [row],
                            embeds: [embed]
                        })

                    } else if (id === 'find_close') {
                        ButtonInteraction.message.delete() // Delete bot embed
                        await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                        db.delete(`${author.id}.findstarted`)
                        delete queries[ButtonInteraction.message.id]
                        db.set(`${author.id}.findquery`, queries)
                        return
                    }

                    ButtonInteraction.deferUpdate()

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