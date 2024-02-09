const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the currently playing song."),
  options: "",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply({ content: "There is currently no song to resume.", ephemeral: true });
    try {
      client.distube.resume(interaction);
      interaction.reply(`<@${interaction.user.id}> resumed the groovy train.`);
    } catch (error) {
      console.log(error);
      return interaction.reply({ content: "Error occurred while trying to resume.", ephemeral: true });
    }
  },
};
