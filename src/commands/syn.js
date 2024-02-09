const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");
const thes = require("thesaurus");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("syn")
    .setDescription("Fetch synonyms for a given word")
    .addStringOption((option) => option.setName("word").setDescription("Word to lookup in thesaurus").setRequired(true)),
  options: "[word]",
  async execute(interaction, args, client) {
    const query = interaction.options.getString("word");
    let results = thes.find(query);

    let synon = results.join(", ");

    if (synon.length == 0) {
      return interaction.reply({
        content:
          "I couldn't find anything for that word. Please ensure to only have one word at a time. Also try to avoid plural forms of words!",
        ephemeral: true,
      });
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle(query)
      .setColor("Orange")
      .addFields([{ name: "Synonyms", value: synon }]);

    return interaction.reply({
      embeds: [embed],
    });
  },
};
