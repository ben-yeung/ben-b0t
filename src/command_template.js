const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("")
    .setDescription("")
    .addStringOption((option) => option.setName("").setDescription("").setRequired(true)),
  options: "",
  async execute(interaction, args, client) {
    return interaction.reply(":)");
  },
};
