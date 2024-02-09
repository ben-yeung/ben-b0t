const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const fetch = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Returns the avatar image of a given user")
    .addUserOption((option) => option.setName("user").setDescription("Who do you request?").setRequired(true)),
  options: "[user]",
  async execute(interaction, args, client) {
    let user = interaction.options.getUser("user");

    // This is the global avatar URL
    const avatarURL = user.avatarURL({
      dynamic: true,
      size: 256,
    });

    // // Fetches Server Profile PFP
    let res = await fetch.get(`https://discord.com/api/guilds/${interaction.guild.id}/members/${user.id}`, {
      headers: {
        Authorization: `Bot ${botconfig.TOKEN}`,
      },
    });

    var displayAvatarURL = `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${user.id}/avatars/${res.data.avatar}?size=256`;

    let avatarEmbed = new EmbedBuilder()
      .setTitle(`${user.username}'s Profile Picture`)
      .setImage(avatarURL)
      .setColor(colors.green_light)
      .setTimestamp();

    let displayAvatarEmbed = new EmbedBuilder()
      .setTitle(`${user.username}'s Profile Picture`)
      .setImage(displayAvatarURL)
      .setColor(colors.green_light)
      .setTimestamp();

    if (res.data.avatar != null) {
      const showServer = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("avatarToggleServer").setLabel("Show Server PFP").setStyle("Primary")
      );

      const showGlobal = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("avatarToggleGlobal").setLabel("Show Global PFP").setStyle("Primary")
      );

      await interaction.reply({ embeds: [avatarEmbed], components: [showServer] });

      const message = await interaction.fetchReply();
      const filter = (btn) => {
        return btn.user.id === interaction.user.id && btn.message.id == message.id;
      };
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90000 });

      collector.on("collect", async (btn) => {
        if (btn.customId == "avatarToggleServer") {
          await interaction.editReply({ embeds: [displayAvatarEmbed], components: [showGlobal] });
        } else if (btn.customId == "avatarToggleGlobal") {
          await interaction.editReply({ embeds: [avatarEmbed], components: [showServer] });
        }

        btn.deferUpdate();
      });
    } else {
      return interaction.reply({ embeds: [avatarEmbed] });
    }
  },
};
