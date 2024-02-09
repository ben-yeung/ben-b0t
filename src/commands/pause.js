const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current song."),
  options: "",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      return interaction.reply("There currently is not a queue. Use /play to get started.");
    }
    const choices = [`has halted the groovy train.`, `cut the beat.`, `pressed pause.`, `stopped the music.`];
    let choice = choices[Math.floor(Math.random() * choices.length)];

    client.distube.pause(interaction);
    return interaction.reply(`<@${interaction.user.id}> ${choice} Use /resume to get it going again.`);
  },
};
