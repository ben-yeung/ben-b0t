const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder().setName("stop").setDescription("Removes ben-b0t from the voice channel"),
  options: "",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      return interaction.reply("There currently is not a queue. Use /play to get started.");
    }
    const choices = [`has halted the groovy train.`, `cut the beat.`, `stopped the music.`];
    let choice = choices[Math.floor(Math.random() * choices.length)];

    client.distube.stop(interaction);
    return interaction.reply(`<@${interaction.user.id}> ${choice} Use /play to get it going again.`);
  },
};
