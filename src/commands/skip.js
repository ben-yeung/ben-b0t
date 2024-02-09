const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song."),
  options: "",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "There aren't any songs playing/in queue.", ephermeral: true });
    }

    try {
      await client.distube.skip(interaction);
      await interaction.reply("Skipping current song");
    } catch (e) {
      await client.distube.pause(interaction);
      interaction.reply("No more songs in queue. Stopping the groovy train.");
    }
  },
};
