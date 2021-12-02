const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const colours = require("../colours.json");
const EBAY = require('ebay-node-api');

//clientID is from registering at https://developer.ebay.com/tools/quick-start
let ebay = new EBAY({
    clientID: botconfig.EBAY_CLIENT_ID,
    clientSecret: botconfig.EBAY_CLIENT_SECRET,
    headers: { // optional
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
})

// Regular prefix command handling
module.exports = {
    name: "ebay",
    description: "Scrapes for sold eBay items based on keywords",
    usage: "?ebay [query]",
    execute(client, message, args) {

        if (!args.length) return message.reply("You must give me keywords to scrape eBay!");

        const query = args.join(" ")

        ebay.findItemsByKeywords({
            keywords: 'Garmin nuvi 1300 Automotive GPS Receiver',
            limit: 10
        }).then((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        });

    }
}