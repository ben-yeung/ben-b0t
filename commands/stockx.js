const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI();
const db = require('quick.db');
const ms = require("ms");
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

module.exports = {
    name: "stockx",
    description: "Search for products on StockX",
    usage: "?stockx [product search]",
    async execute(client, message, args) {

        let search = args.join(" ")
        if (!search) return message.reply("Please include a search query for this command.")
        const author = message.author
        const authorMessageID = message.id
        const stockxThumb = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvrPpUs4t1COoRogWZNeQrFC6UVvc6AQzXyCFUWnVVk_Ycg5yZXGQvqEqKfDea6QxYAus&usqp=CAU'

        if (db.get(`${author.id}.stockxstarted`) && Date.now() - db.get(`${author.id}.stockxstarted`) <= 15000) {
            return message.reply(`Please close your most recent stockx command or wait ${ms(15000 - (Date.now()- db.get(`${author.id}.stockxstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.stockxstarted`, Date.now())
        }

        const intros = ['Searching StockX for', 'Scouring StockX for', 'Researching scholarly articles on StockX for', 'Paying resell to find', 'Checking a StockX picture book for', 'Feeling resell lucky? Looking for', 'Hey Alexa, look on StockX for', 'Hey Siri, search on StockX for', 'Asking a reseller for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${search}\` <a:stockx:872713212901093486>`).then(async (message) => {
            try {
                const products = await stockX.newSearchProducts(search, {
                    limit: 10
                });

                if (products.length == 0) {
                    db.delete(`${author.id}.stockxstarted`)
                    return message.reply("Could not find results on StockX for that search.")
                }

                let currInd = 0
                let stockXName = products[currInd].name
                let stockXImage = products[currInd].media.imageUrl
                let stockXURL = `https://stockx.com/${products[currInd].url}`
                let retail = `$${products[currInd].price}`
                let highBid = `$${products[currInd].highest_bid}`
                let lowAsk = `$${products[currInd].lowest_ask}`
                let lastSale = `$${products[currInd].last_sale}`
                let releaseDate = (products[currInd].release_date == '' ? 'N/A' : products[currInd].release_date)
                let styleID = (products[currInd].style_id == '' ? products[currInd].ticker_symbol : products[currInd].style_id)
                let colorway = products[currInd].colorway
                let category = products[currInd].product_category
                //console.log(products[currInd])

                let embed = new Discord.MessageEmbed()
                    .setTitle(`**${stockXName}**`)
                    .setDescription(` **Released:** ${releaseDate} \n **Colorway:** ${colorway} \n **ID/Ticker:** ${styleID}\n`)
                    .setColor(colours.stockx)
                    .setImage(stockXImage)
                    .addField("Retail Price", retail, true)
                    .addField("Last Sale", lastSale, true)
                    .addField("\u200B", '\u200B', true)
                    .addField("Highest Bid", highBid, true)
                    .addField("Lowest Ask", lowAsk, true)
                    .addField("\u200B", '\u200B', true)
                    .setThumbnail(stockxThumb)
                    .setFooter(`${category} | Page ${currInd + 1}`)
                    .setTimestamp()

                const nextBtn = new MessageButton()
                    .setLabel('Next')
                    .setCustomId('stockx_next')
                    .setStyle('PRIMARY')

                const prevBtn = new MessageButton()
                    .setLabel('Prev')
                    .setCustomId('stockx_prev')
                    .setStyle('PRIMARY')

                const closeBtn = new MessageButton()
                    .setLabel('Close')
                    .setCustomId('stockx_close')
                    .setStyle('DANGER')

                const sourceBtn = new MessageButton()
                    .setLabel('Source')
                    .setURL(stockXURL)
                    .setStyle('LINK')

                prevBtn.disabled = true
                const row = new MessageActionRow().addComponents(
                    nextBtn, prevBtn, sourceBtn, closeBtn
                )

                message.edit(' ­') //invisible char to make embed edit cleaner
                message.edit({
                    components: [row],
                    embeds: [embed]
                }).then(async (message) => {
                    if (currInd >= products.length) return

                    const filter = (btn) => {
                        return author.id === btn.user.id
                    }

                    const collector = message.channel.createMessageComponentCollector({
                        filter,
                        time: 120000
                    })

                    collector.on('collect', async (ButtonInteraction) => {
                        const id = ButtonInteraction.customId

                        if (id === 'stockx_next') {
                            prevBtn.disabled = false
                            currInd++
                            let stockXName = products[currInd].name
                            let stockXImage = products[currInd].media.imageUrl
                            let stockXURL = `https://stockx.com/${products[currInd].url}`
                            let retail = `$${products[currInd].price}`
                            let highBid = `$${products[currInd].highest_bid}`
                            let lowAsk = `$${products[currInd].lowest_ask}`
                            let lastSale = `$${products[currInd].last_sale}`
                            let releaseDate = (products[currInd].release_date == '' ? 'N/A' : products[currInd].release_date)
                            let styleID = (products[currInd].style_id == '' ? products[currInd].ticker_symbol : products[currInd].style_id)
                            let colorway = products[currInd].colorway
                            let category = products[currInd].product_category
                            //console.log(products[currInd])

                            let embed = new Discord.MessageEmbed()
                                .setTitle(`**${stockXName}**`)
                                .setDescription(` **Released:** ${releaseDate} \n **Colorway:** ${colorway} \n **ID/Ticker:** ${styleID}\n`)
                                .setColor(colours.stockx)
                                .setImage(stockXImage)
                                .addField("Retail Price", retail, true)
                                .addField("Last Sale", lastSale, true)
                                .addField("\u200B", '\u200B', true)
                                .addField("Highest Bid", highBid, true)
                                .addField("Lowest Ask", lowAsk, true)
                                .addField("\u200B", '\u200B', true)
                                .setThumbnail(stockxThumb)
                                .setFooter(`${category} | Page ${currInd + 1}`)
                                .setTimestamp()

                            if (currInd == 9 || currInd == products.length) {
                                nextBtn.disabled = true
                            } else {
                                nextBtn.disabled = false
                            }

                            sourceBtn.setURL(stockXURL)
                            const row = new MessageActionRow().setComponents(
                                nextBtn, prevBtn, sourceBtn, closeBtn
                            )
                            await ButtonInteraction.message.edit({
                                components: [row],
                                embeds: [embed]
                            })

                        } else if (id === 'stockx_prev') {
                            nextBtn.disabled = false
                            currInd--
                            let stockXName = products[currInd].name
                            let stockXImage = products[currInd].media.imageUrl
                            let stockXURL = `https://stockx.com/${products[currInd].url}`
                            let retail = `$${products[currInd].price}`
                            let highBid = `$${products[currInd].highest_bid}`
                            let lowAsk = `$${products[currInd].lowest_ask}`
                            let lastSale = `$${products[currInd].last_sale}`
                            let releaseDate = (products[currInd].release_date == '' ? 'N/A' : products[currInd].release_date)
                            let styleID = (products[currInd].style_id == '' ? products[currInd].ticker_symbol : products[currInd].style_id)
                            let colorway = products[currInd].colorway
                            let category = products[currInd].product_category
                            //console.log(products[currInd])

                            let embed = new Discord.MessageEmbed()
                                .setTitle(`**${stockXName}**`)
                                .setDescription(` **Released:** ${releaseDate} \n **Colorway:** ${colorway} \n **ID/Ticker:** ${styleID}\n`)
                                .setColor(colours.stockx)
                                .setImage(stockXImage)
                                .addField("Retail Price", retail, true)
                                .addField("Last Sale", lastSale, true)
                                .addField("\u200B", '\u200B', true)
                                .addField("Highest Bid", highBid, true)
                                .addField("Lowest Ask", lowAsk, true)
                                .addField("\u200B", '\u200B', true)
                                .setThumbnail(stockxThumb)
                                .setFooter(`${category} | Page ${currInd + 1}`)
                                .setTimestamp()

                            if (currInd === 0) {
                                prevBtn.disabled = true
                            }

                            sourceBtn.setURL(stockXURL)
                            const row = new MessageActionRow().setComponents(
                                nextBtn, prevBtn, sourceBtn, closeBtn
                            )
                            await ButtonInteraction.message.edit({
                                components: [row],
                                embeds: [embed]
                            })

                        } else if (id === 'stockx_close') {
                            ButtonInteraction.message.delete() // Delete bot embed
                            await message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                            db.delete(`${author.id}.stockxstarted`)
                            return
                        }

                        ButtonInteraction.deferUpdate()

                    })

                })

            } catch (e) {
                console.log(e)
                message.edit("Could not find a valid product.")
            }
        })

    }
}