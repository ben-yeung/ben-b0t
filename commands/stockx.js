const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI();
const db = require('quick.db');
const ms = require("ms");
const {
    MessageButton
} = require('discord-buttons');

module.exports = {
    name: "stockx",
    description: "Search for products on StockX",
    usage: "?stockx [product search]",
    async execute(client, message, args) {

        let search = args.join(" ")
        if (!search) return message.reply("Please include a search query for this command.")
        const author = message.author
        const authorMessageID = message.id

        if (db.get(`${author.id}.findstarted`) && Date.now() - db.get(`${author.id}.findstarted`) <= 15000) {
            return message.reply(`Please close your most recent find command or wait ${ms(15000 - (Date.now()- db.get(`${author.id}.findstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.findstarted`, Date.now())
        }

        const intros = ['Searching StockX for', 'Scouring StockX for', 'Researching scholarly articles on StockX for', 'Paying resell to find', 'Checking a StockX picture book for', 'Feeling resell lucky? Looking for', 'Hey Alexa, look on StockX for', 'Hey Siri, search on StockX for', 'Asking a reseller for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${search}\` <a:stockx:872713212901093486>`).then(async (message) => {
            try {
                const products = await stockX.newSearchProducts(search, {
                    limit: 10
                });

                if (products.length == 0) {
                    db.delete(`${author.id}.findstarted`)
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
                console.log(products[currInd])

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
                    .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvrPpUs4t1COoRogWZNeQrFC6UVvc6AQzXyCFUWnVVk_Ycg5yZXGQvqEqKfDea6QxYAus&usqp=CAU')
                    .setFooter(`${category} | Page ${currInd + 1}`)
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
                    .setURL(stockXURL)
                    .setStyle('url')

                message.edit(' ­') //invisible char to make embed edit cleaner
                message.edit({
                    buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                    embed: embed
                }).then(async (message) => {
                    if (currInd >= products.length) return

                    const collector = message.createButtonCollector((button) => button.clicker.user.id === author.id && Date.now() - db.get(`${button.clicker.user.id}.findstarted`) < 15000, {
                        time: 60000
                    })

                    collector.on('collect', async (b) => {
                        // console.log(b.id)

                        if (b.id === 'find_next') {
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
                            console.log(products[currInd])

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
                                .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvrPpUs4t1COoRogWZNeQrFC6UVvc6AQzXyCFUWnVVk_Ycg5yZXGQvqEqKfDea6QxYAus&usqp=CAU')
                                .setFooter(`${category} | Page ${currInd + 1}`)
                                .setTimestamp()

                            if (currInd == 9 || currInd == products.length) {
                                nextBtn.disabled = true
                            } else {
                                nextBtn.disabled = false
                            }

                            sourceBtn.setURL(stockXURL)
                            await b.message.edit({
                                buttons: [prevBtn, nextBtn, sourceBtn, closeBtn],
                                embed: embed
                            })

                        } else if (b.id === 'find_prev') {
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
                            console.log(products[currInd])

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
                                .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvrPpUs4t1COoRogWZNeQrFC6UVvc6AQzXyCFUWnVVk_Ycg5yZXGQvqEqKfDea6QxYAus&usqp=CAU')
                                .setFooter(`${category} | Page ${currInd + 1}`)
                                .setTimestamp()

                            if (currInd === 0) {
                                prevBtn.disabled = true
                            }

                            sourceBtn.setURL(stockXURL)
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

            } catch (e) {
                console.log(e)
                message.edit("Could not find a valid product.")
            }
        })

    }
}