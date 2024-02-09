const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const colors = require("../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear my last X messages from chat.")
    .addNumberOption((option) => option.setName("amount").setDescription("Number of messages to delete").setRequired(true)),
  options: "[amount]",
  async execute(interaction, args, client) {
    let amount = interaction.options.getNumber("amount");
    if (amount > 100) return message.reply("You can't delete more than 100 messages at once!"); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return message.reply("You have to delete at least 1 message!"); // Checks if the `amount` integer is smaller than 1

    try {
      const toDelete = [];
      var count = 0;
      await interaction.channel.messages
        .fetch({
          limit: 100,
        })
        .then(async (messages) => {
          messages.filter((msg) => {
            if (count < amount && msg.author.id == interaction.user.id) {
              toDelete.push(msg);
              count += 1;
            }
          });
        });

      await interaction.channel.bulkDelete(toDelete, true);

      return interaction.reply({ content: `Successfully deleted ${count} messages`, ephemeral: true });
    } catch (e) {
      console.log(e);
      return interaction.reply({ content: `Encountered an issue while trying to delete.`, ephemeral: true });
    }
  },
};
