const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the Magic Oracle a question and receive an answer.")
    .addStringOption((option) => option.setName("question").setDescription("What do you ask of the Magic 8Ball?").setRequired(true)),
  options: "[question]",
  async execute(interaction, args, client) {
    let replies = [
      "Maybe",
      "Yes",
      "No",
      "Ask again later",
      "Definitely Yes",
      "I'm leaning towards no",
      "I think so",
      "Very doubtful",
      "Yessir",
      "Negative",
    ];
    let question = interaction.options.getString("question");
    let num = Math.floor(Math.random() * replies.length);

    const embed = new Discord.EmbedBuilder()
      .setColor(colors.purple_medium)
      .setTitle("Magic :8ball: Oracle")
      .addFields([
        { name: "Question:", value: question },
        { name: "Answer:", value: replies[num] },
      ]);

    return interaction.reply({
      embeds: [embed],
    });
  },
};
