const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const StockXData = require("stockx-data");
const stockx = new StockXData();
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
        const stockxThumb = 'https://pbs.twimg.com/profile_images/1382744393594064901/_s7Up6o__400x400.jpg'

        if (db.get(`${author.id}.stockxstarted`) && Date.now() - db.get(`${author.id}.stockxstarted`) <= 15000) {
            return message.reply(`Please close your most recent stockx command or wait ${ms(15000 - (Date.now()- db.get(`${author.id}.stockxstarted`)))} before starting another query!`)
        } else {
            db.set(`${author.id}.stockxstarted`, Date.now())
        }

        const intros = ['Searching StockX for', 'Scouring StockX for', 'Researching scholarly articles on StockX for', 'Paying resell to find', 'Checking a StockX picture book for', 'Feeling resell lucky? Looking for', 'Hey Alexa, look on StockX for', 'Hey Siri, search on StockX for', 'Asking a reseller for']
        let choice = intros[Math.floor(Math.random() * intros.length)]
        message.channel.send(`${choice} \`${search}\` <a:stockx:872713212901093486>`).then(async (message) => {
            try {

                stockx.searchProducts(search).then(async (productFound) => {
                    if (productFound.length == 0) {
                        db.delete(`${author.id}.stockxstarted`)
                        message.edit("Could not find results on StockX for that search.")
                        return
                    }
                    console.log(productFound)
                    var currInd = 0;
                    var productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid)
                    console.log(`${search} length ${productDetail.length}`)

                    let name = productDetail.name;
                    let thumbnail = productDetail.image;
                    let styleID = productDetail.pid || "N/A";
                    let retail = (productDetail.details.retail) ? `$${productDetail.details.retail}` : "N/A";
                    let releaseDate = productDetail.details.releaseDate || "N/A";
                    let colorway = productDetail.details.colorway || "N/A";
                    let lowestAsk = (productDetail.market.lowestAsk) ? `$${productDetail.market.lowestAsk}` : "N/A";
                    let highestBid = (productDetail.market.highestBid) ? `$${productDetail.market.highestBid}` : "N/A";
                    let totalSales = productDetail.market.deadstockSold || "N/A";
                    let lastSale = (productDetail.market.lastSale) ? `$${productDetail.market.lastSale}` : "N/A";
                    let lastSaleSize = (productDetail.market.lastSaleSize) ? `| Size ${productDetail.market.lastSaleSize}` : "";
                    let annualHigh = (productDetail.market.annualHigh) ? `$${productDetail.market.annualHigh}` : "N/A";
                    let annualLow = (productDetail.market.annualLow) ? `$${productDetail.market.annualLow}` : "N/A";
                    let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`**${name}**`)
                        .setDescription(`**Released:** ${releaseDate} \n **Colorway:** ${colorway}`)
                        .setColor(colours.stockx)
                        .setImage(thumbnail)
                        .addField("Retail Price", `${retail}`, true)
                        .addField("Lowest Ask", `${lowestAsk}`, true)
                        .addField("Highest Bid", `${highestBid}`, true)
                        .addField("Total Sales", `${totalSales}`, true)
                        .addField("Last Sale", `${lastSale} ${lastSaleSize}`, true)
                        .addField("\u200B", '\u200B', true)
                        .addField("Annual High", `${annualHigh}`, true)
                        .addField("Annual Low", `${annualLow}`, true)
                        .setThumbnail(stockxThumb)
                        .setFooter(`Page ${currInd + 1}`)
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
                        .setURL(sourceURL)
                        .setStyle('LINK')

                    prevBtn.disabled = true
                    const row = new MessageActionRow().addComponents(
                        prevBtn, nextBtn, sourceBtn, closeBtn
                    )

                    message.edit(' ­') //invisible char to make embed edit cleaner
                    message.edit({
                        components: [row],
                        embeds: [embed]
                    }).then(async (message) => {
                        if (currInd >= productFound.length) return

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
                                productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid)
                                console.log(productDetail)

                                let name = productDetail.name;
                                let thumbnail = productDetail.image;
                                let styleID = productDetail.pid || "N/A";
                                let retail = (productDetail.details.retail) ? `$${productDetail.details.retail}` : "N/A";
                                let releaseDate = productDetail.details.releaseDate || "N/A";
                                let colorway = productDetail.details.colorway || "N/A";
                                let lowestAsk = (productDetail.market.lowestAsk) ? `$${productDetail.market.lowestAsk}` : "N/A";
                                let highestBid = (productDetail.market.highestBid) ? `$${productDetail.market.highestBid}` : "N/A";
                                let totalSales = productDetail.market.deadstockSold || "N/A";
                                let lastSale = (productDetail.market.lastSale) ? `$${productDetail.market.lastSale}` : "N/A";
                                let lastSaleSize = (productDetail.market.lastSaleSize) ? `| Size ${productDetail.market.lastSaleSize}` : "";
                                let annualHigh = (productDetail.market.annualHigh) ? `$${productDetail.market.annualHigh}` : "N/A";
                                let annualLow = (productDetail.market.annualLow) ? `$${productDetail.market.annualLow}` : "N/A";
                                let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`

                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`**${name}**`)
                                    .setDescription(`**Released:** ${releaseDate} \n **Colorway:** ${colorway} \n **ID/Ticker:** ${styleID}\n`)
                                    .setColor(colours.stockx)
                                    .setImage(thumbnail)
                                    .addField("Retail Price", `${retail}`, true)
                                    .addField("Lowest Ask", `${lowestAsk}`, true)
                                    .addField("Highest Bid", `${highestBid}`, true)
                                    .addField("Total Sales", `${totalSales}`, true)
                                    .addField("Last Sale", `${lastSale} ${lastSaleSize}`, true)
                                    .addField("Annual High", `${annualHigh}`, true)
                                    .addField("Annual Low", `${annualLow}`, true)
                                    .setThumbnail(stockxThumb)
                                    .setFooter(`Page ${currInd + 1}`)
                                    .setTimestamp()

                                if (currInd == productFound.length - 1) {
                                    nextBtn.disabled = true
                                } else {
                                    nextBtn.disabled = false
                                }

                                sourceBtn.setURL(sourceURL)
                                const row = new MessageActionRow().setComponents(
                                    prevBtn, nextBtn, sourceBtn, closeBtn
                                )
                                await ButtonInteraction.message.edit({
                                    components: [row],
                                    embeds: [embed]
                                })

                            } else if (id === 'stockx_prev') {
                                nextBtn.disabled = false
                                currInd--
                                productDetail = await stockx.fetchProductDetails(productFound[currInd].uuid)
                                console.log(productDetail)

                                let name = productDetail.name;
                                let thumbnail = productDetail.image;
                                let styleID = productDetail.pid || "N/A";
                                let retail = (productDetail.details.retail) ? `$${productDetail.details.retail}` : "N/A";
                                let releaseDate = productDetail.details.releaseDate || "N/A";
                                let colorway = productDetail.details.colorway || "N/A";
                                let lowestAsk = (productDetail.market.lowestAsk) ? `$${productDetail.market.lowestAsk}` : "N/A";
                                let highestBid = (productDetail.market.highestBid) ? `$${productDetail.market.highestBid}` : "N/A";
                                let totalSales = productDetail.market.deadstockSold || "N/A";
                                let lastSale = (productDetail.market.lastSale) ? `$${productDetail.market.lastSale}` : "N/A";
                                let lastSaleSize = (productDetail.market.lastSaleSize) ? `| Size ${productDetail.market.lastSaleSize}` : "";
                                let annualHigh = (productDetail.market.annualHigh) ? `$${productDetail.market.annualHigh}` : "N/A";
                                let annualLow = (productDetail.market.annualLow) ? `$${productDetail.market.annualLow}` : "N/A";
                                let sourceURL = `https://stockx.com/${productDetail.market.productUuid}`

                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`**${name}**`)
                                    .setDescription(`**Released:** ${releaseDate} \n **Colorway:** ${colorway} \n **ID/Ticker:** ${styleID}\n`)
                                    .setColor(colours.stockx)
                                    .setImage(thumbnail)
                                    .addField("Retail Price", `${retail}`, true)
                                    .addField("Lowest Ask", `${lowestAsk}`, true)
                                    .addField("Highest Bid", `${highestBid}`, true)
                                    .addField("Total Sales", `${totalSales}`, true)
                                    .addField("Last Sale", `${lastSale} ${lastSaleSize}`, true)
                                    .addField("Annual High", `${annualHigh}`, true)
                                    .addField("Annual Low", `${annualLow}`, true)
                                    .setThumbnail(stockxThumb)
                                    .setFooter(`Page ${currInd + 1}`)
                                    .setTimestamp()

                                if (currInd === 0) {
                                    prevBtn.disabled = true
                                }
                                sourceBtn.setURL(sourceURL)
                                const row = new MessageActionRow().setComponents(
                                    prevBtn, nextBtn, sourceBtn, closeBtn
                                )

                                await ButtonInteraction.message.edit({
                                    components: [row],
                                    embeds: [embed]
                                })

                            } else if (id === 'stockx_close') {
                                ButtonInteraction.message.delete() // Delete bot embed
                                await ButtonInteraction.message.channel.messages.fetch(authorMessageID).then(message => message.delete()).catch(console.error) // Delete user command call
                                db.delete(`${author.id}.stockxstarted`)
                                ButtonInteraction.deferUpdate()
                                collector.stop()
                                return
                            }

                            ButtonInteraction.deferUpdate()

                        })

                    })


                })

            } catch (e) {
                console.log(e)
                db.delete(`${author.id}.stockxstarted`)
                message.edit("Could not find a valid product.")
            }
        })

    }
}