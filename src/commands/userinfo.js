const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Fetches user's information relevant to the server/account.")
    .addUserOption((option) => option.setName("user").setDescription("Who would you like to query?").setRequired(true)),
  options: "[user]",
  async execute(interaction, args, client) {
    var user = interaction.options.getUser("user");

    // removing roles that are not relevant (role dividers)
    const excludedRoles = ["821543047832797214", "821544278063972372", "821543454654857247"];

    const member = await interaction.guild.members.fetch(user.id);

    var roles =
      member.roles.cache
        .map((r) => r)
        .filter((role) => !excludedRoles.includes(role.id))
        .join(" ")
        .replace("@everyone", "") || "None";

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${member.user.tag}`)
      .setThumbnail(
        member.user.avatarURL({
          dynamic: true,
          size: 512,
        })
      )
      .setDescription(`ID: ${member.user.id} `)
      .addFields([
        { name: "Roles", value: `${roles}`, inline: true },
        { name: "Member Since ", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>` },
        { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      ])
      // .addField("Roles", `${roles}`, true)
      // .addField("Member Since ", `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
      // .addField("Account Created", `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, true)
      .setColor(colors.cyan);
    // .setFooter({ text: `Status: ${member.presence.status}` });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
