const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder().setName("queue").setDescription("View the current queue."),
  options: "",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "There aren't any songs playing/in queue.", ephermeral: true });
    }
    const list = `${queue.songs
      .map((song, id) => `**${id ? id : "Playing"}**: ${song.name} - \`${song.formattedDuration}\``)
      .slice(0, 10)
      .join("\n")}`;

    let embed = new Discord.EmbedBuilder()
      .setTitle("Current Queue")
      .setDescription(list)
      .setThumbnail("https://www.pngmart.com/files/20/Youtube-Logo-Transparent-PNG.png")
      .setColor("Red")
      .setTimestamp();
    interaction.reply({
      embeds: [embed],
    });
  },
};
