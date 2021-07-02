const Discord = require("discord.js")
const colours = require("../colours.json");

module.exports = {
    name: "ping",
    description: "Displays api and bot latency",
    slash: true,
    callback: ({}) => {
        return 'pong!!!'
    },
}