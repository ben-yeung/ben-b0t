const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../botconfig.json");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Get the list of current commands."),
  options: "",
  async execute(interaction, args, client) {
    let helpDesc = `These are the current commands available for use!`;

    exclusions = ["help", "modclear", "say"];

    var pages = {};
    var c = 0;
    pages[c] = [];
    var charCount = 0; //each embed can only have 1024 chars max
    client.commands.forEach((value, key) => {
      if (!exclusions.includes(key)) {
        if (charCount > 400) {
          c += 1;
          pages[c] = [];
          charCount = 0;
        }

        pages[c].push(`**/${key}** ${value.options} \n ${value.data.description}`);
        charCount += key.length + value.options.length + value.data.description.length + 10;
      }
    });

    var embeds = [];
    for (var i = 0; i < Object.keys(pages).length; i++) {
      let embed = new Discord.EmbedBuilder()
        .setColor(botconfig.COLOR_SCHEME)
        .setTitle(`Active Commands | Page ${i + 1}`)
        .setDescription(pages[i].join("\n\n"))
        .setFooter({
          text: "Created with ❤️ by ben.#0673",
        });

      embeds.push(embed);
    }

    const nextBtn = new ButtonBuilder().setLabel("Next").setCustomId("help_next").setStyle("Primary");
    const prevBtn = new ButtonBuilder().setLabel("Prev").setCustomId("help_prev").setStyle("Primary");
    prevBtn.disabled = true;

    const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn);

    var currInd = 0;
    const author = interaction.user;
    await interaction.reply({ embeds: [embeds[0]], components: [row], ephemeral: true });

    if (currInd >= embeds.length) return;

    const filter = (btn) => {
      return author.id === btn.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 90000,
    });

    collector.on("collect", async (btn) => {
      //console.log(btn.customId)
      const id = btn.customId;
      if (id === "help_next") {
        prevBtn.disabled = false;
        currInd++;
        let embed = embeds[currInd];

        if (currInd + 1 == embeds.length) {
          nextBtn.disabled = true;
        } else {
          nextBtn.disabled = false;
        }
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn);
        await interaction.editReply({
          components: [row],
          embeds: [embed],
        });
      } else if (id === "help_prev") {
        nextBtn.disabled = false;
        currInd--;
        let embed = embeds[currInd];

        if (currInd === 0) {
          prevBtn.disabled = true;
        }
        const row = new ActionRowBuilder().addComponents(prevBtn, nextBtn);
        await interaction.editReply({
          components: [row],
          embeds: [embed],
        });
      }

      btn.deferUpdate();
    });
  },
};
