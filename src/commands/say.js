const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Makes the bot speak in a certain channel.")
    .addChannelOption((option) => option.setName("channel").setDescription("Channel to send the message to.").setRequired(true))
    .addStringOption((option) => option.setName("message").setDescription("Message to send.").setRequired(true)),
  options: "[channel] [message]",
  async execute(interaction, args, client) {
    if (!interaction.channel.permissionsFor(interaction.member).has("MANAGE_CHANNELS"))
      return interaction.reply({ content: "Sorry, you don't have access to that command.", ephemeral: true });

    let argsresult = interaction.options.getString("message");
    let mChannel = interaction.options.getChannel("channel");

    await mChannel.send(argsresult);
  },
};
