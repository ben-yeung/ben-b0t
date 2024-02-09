const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const math = require("mathjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("Compute a given equation.")
    .addStringOption((option) => option.setName("expression").setDescription("ie '1 + 1'").setRequired(true)),
  options: "[expression]",
  async execute(interaction, args, client) {
    let resp;
    try {
      let expr = interaction.options.getString("expression");
      resp = math.evaluate(expr);

      const embed = new Discord.EmbedBuilder()
        .setColor(colors.blue_light)
        .setTitle("According to my calculations...")
        .addFields([
          { name: "**Input**", value: `\`\`\`\n${expr}\`\`\`` },
          { name: "**Output**", value: `\`\`\`\n${resp}\`\`\`` },
        ]);

      interaction.reply({
        embeds: [embed],
      });
    } catch (e) {
      return interaction.reply({ content: "Sorry I couldn't compute that. It may not be a valid calculation.", ephemeral: true });
    }
  },
};
