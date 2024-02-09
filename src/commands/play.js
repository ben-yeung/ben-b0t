const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Request ben-b0t to play videos from YouTube via link/search.")
    .addStringOption((option) => option.setName("query").setDescription("Can be a YouTube link or YouTube search").setRequired(true)),
  options: "[query]",
  async execute(interaction, args, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({ content: "You must be in a voice channel to use this command.", ephemeral: true });

    const queue = client.distube.getQueue(interaction);
    try {
      const query = interaction.options.getString("query");
      // if (queue) {
      //   if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
      //     return interaction.reply({ content: "I can only be in one channel at a time in here.", ephemeral: true });
      //   }
      // }
      await interaction.reply(`Scraping YouTube to find \`${query}\` <a:working:821570743329882172>`);
      const VC = interaction.member.voice.channel;
      await client.distube.play(VC, query, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
      await interaction.deleteReply();
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        content: "Erorr while attempting to play given song/link. Spotify is currently not working.",
        ephemeral: true,
      });
    }
  },
};
